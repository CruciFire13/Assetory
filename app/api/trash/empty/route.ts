import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { assets, folders, users } from "@/lib/db/schema";
import { deleteFromImageKit } from "@/lib/imagekit";
import { and, eq } from "drizzle-orm";

// Recursive folder delete with size accumulation
async function deleteTrashedFolder(folderId: string, userId: string): Promise<number> {
  let storageFreed = 0;

  const childFolders = await db
    .select()
    .from(folders)
    .where(and(eq(folders.parentId, folderId), eq(folders.userId, userId)));

  for (const child of childFolders) {
    storageFreed += await deleteTrashedFolder(child.id, userId);
  }

  const folderAssets = await db
    .select()
    .from(assets)
    .where(and(eq(assets.folderId, folderId), eq(assets.userId, userId)));

  for (const asset of folderAssets) {
    storageFreed += asset.fileSize;
    try {
      if (asset.fileId) {
        await deleteFromImageKit(asset.fileId);
      }
    } catch (err) {
      console.warn(`[ImageKit Delete Failed] ${asset.name}`, err);
    }
  }

  await db.delete(assets).where(and(eq(assets.folderId, folderId), eq(assets.userId, userId)));
  await db.delete(folders).where(and(eq(folders.id, folderId), eq(folders.userId, userId)));

  return storageFreed;
}

export async function DELETE() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let totalFreed = 0;

    // Delete trashed assets
    const trashedAssets = await db
      .select()
      .from(assets)
      .where(and(eq(assets.userId, userId), eq(assets.isTrashed, true)));

    for (const asset of trashedAssets) {
      totalFreed += asset.fileSize;
      try {
        if (asset.fileId) {
          await deleteFromImageKit(asset.fileId);
        }
      } catch (err) {
        console.warn(`[ImageKit Delete Failed] ${asset.name}`, err);
      }
    }

    await db.delete(assets).where(and(eq(assets.userId, userId), eq(assets.isTrashed, true)));

    // Delete trashed folders recursively
    const trashedFolders = await db
      .select()
      .from(folders)
      .where(and(eq(folders.userId, userId), eq(folders.isTrashed, true)));

    for (const folder of trashedFolders) {
      totalFreed += await deleteTrashedFolder(folder.id, userId);
    }

    // Update user storage
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const newStorage = Math.max((user?.storageUsed ?? 0) - totalFreed, 0);

    await db.update(users).set({ storageUsed: newStorage }).where(eq(users.id, userId));

    return NextResponse.json({ success: true, storageFreed: totalFreed }, { status: 200 });
  } catch (error) {
    console.error("[EMPTY_TRASH_ERROR]", error);
    return NextResponse.json({ error: "Failed to empty trash" }, { status: 500 });
  }
}
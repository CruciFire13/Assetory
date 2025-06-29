import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { folders, assets, users } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { deleteFromImageKit } from "@/lib/imagekit";

export async function DELETE(
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const folderId = resolvedParams.id;
    let storageFreed = 0;

    // Recursive deletion helper
    async function deleteFolderRecursively(id: string) {
      // 1. Find child folders
      const childFolders = await db
        .select()
        .from(folders)
        .where(and(eq(folders.parentId, id), eq(folders.userId, userId as string)));

      // 2. Recursively delete children first
      for (const child of childFolders) {
        await deleteFolderRecursively(child.id);
      }

      // 3. Delete all assets inside this folder (DB + ImageKit)
      const folderAssets = await db
        .select()
        .from(assets)
        .where(and(eq(assets.folderId, id), eq(assets.userId, userId as string)));

      for (const asset of folderAssets) {
        try {
          if (asset.fileId) {
            await deleteFromImageKit(asset.fileId);
          }
        } catch (err) {
          console.warn(`[ImageKit Delete Failed] ${asset.name}`, err);
        }

        // Add to total storage freed
        storageFreed += asset.fileSize || 0;
      }

      // 4. Delete assets from DB
      await db
        .delete(assets)
        .where(and(eq(assets.folderId, id), eq(assets.userId, userId as string)));

      // 5. Delete this folder
      await db
        .delete(folders)
        .where(and(eq(folders.id, id), eq(folders.userId, userId as string)));
    }

    // Ensure folder belongs to user
    const [folder] = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, userId)));

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Delete recursively
    await deleteFolderRecursively(folderId);

    // Subtract freed storage from user's used storage
    await db
    .update(users)
    .set({
        storageUsed: sql`GREATEST(${users.storageUsed} - ${storageFreed}, 0)`
    })
    .where(eq(users.id, userId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[RECURSIVE_FOLDER_DELETE_ERROR]", err);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}
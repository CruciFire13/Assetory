import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { sharedAccess, folders, assets, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch shared folders and assets in parallel with user info
    const [sharedFolders, sharedAssets] = await Promise.all([
      db
        .select({
          id: folders.id,
          name: folders.name,
          createdAt: folders.createdAt,
          sharedBy: sharedAccess.sharedBy,
          sharedByName: users.name,
          sharedByEmail: users.email,
        })
        .from(sharedAccess)
        .innerJoin(folders, eq(sharedAccess.itemId, folders.id))
        .innerJoin(users, eq(sharedAccess.sharedBy, users.id))
        .where(
          and(
            eq(sharedAccess.sharedWith, userId),
            eq(sharedAccess.type, "folder")
          )
        ),

      db
        .select({
          id: assets.id,
          name: assets.name,
          fileType: assets.fileType,
          url: assets.url,
          fileSize: assets.fileSize,
          createdAt: assets.createdAt,
          sharedBy: sharedAccess.sharedBy,
          sharedByName: users.name,
          sharedByEmail: users.email,
        })
        .from(sharedAccess)
        .innerJoin(assets, eq(sharedAccess.itemId, assets.id))
        .innerJoin(users, eq(sharedAccess.sharedBy, users.id))
        .where(
          and(
            eq(sharedAccess.sharedWith, userId),
            eq(sharedAccess.type, "asset")
          )
        ),
    ]);

    return NextResponse.json(
      {
        folders: sharedFolders,
        assets: sharedAssets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SHARED_ITEMS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch shared items" },
      { status: 500 }
    );
  }
}
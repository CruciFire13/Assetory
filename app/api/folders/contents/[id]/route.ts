import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { assets, folders } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params before accessing properties
    const resolvedParams = await params;
    const folderId = resolvedParams.id;

    // Get the folder info first
    const [folderInfo] = await db
      .select()
      .from(folders)
      .where(
        and(
          eq(folders.id, folderId),
          eq(folders.userId, userId),
          eq(folders.isTrashed, false)
        )
      )
      .limit(1);

    if (!folderInfo) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }

    const [childFolders, childAssets] = await Promise.all([
      db
        .select()
        .from(folders)
        .where(
          and(
            eq(folders.userId, userId),
            eq(folders.parentId, folderId),
            eq(folders.isTrashed, false)
          )
        ),
      db
        .select()
        .from(assets)
        .where(
          and(
            eq(assets.userId, userId),
            eq(assets.folderId, folderId),
            eq(assets.isTrashed, false)
          )
        ),
    ]);

    return NextResponse.json(
      {
        // Include folder info
        id: folderInfo.id,
        name: folderInfo.name,
        parentId: folderInfo.parentId,
        createdAt: folderInfo.createdAt,
        // Include contents
        folders: childFolders,
        assets: childAssets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET_FOLDER_CONTENTS_ERROR]", error);
    return NextResponse.json(
      { error: "Unable to fetch folder contents" },
      { status: 500 }
    );
  }
}
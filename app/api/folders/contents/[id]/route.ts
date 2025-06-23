import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { assets, folders } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
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
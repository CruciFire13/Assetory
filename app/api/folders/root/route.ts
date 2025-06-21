import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { folders, assets } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rootFolders, rootAssets] = await Promise.all([
      db
        .select()
        .from(folders)
        .where(
          and(
            eq(folders.userId, userId),
            isNull(folders.parentId),
            eq(folders.isTrashed, false)
          )
        ),
      db
        .select()
        .from(assets)
        .where(
          and(
            eq(assets.userId, userId),
            isNull(assets.folderId),
            eq(assets.isTrashed, false)
          )
        ),
    ]);

    return NextResponse.json(
      {
        folders: rootFolders,
        assets: rootAssets,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET_ROOT_CONTENT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch root-level contents" },
      { status: 500 }
    );
  }
}
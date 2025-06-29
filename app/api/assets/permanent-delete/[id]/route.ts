import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { assets, users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { deleteFromImageKit } from "@/lib/imagekit";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Await params before accessing properties
    const resolvedParams = await params;
    const assetId = resolvedParams.id;

    const [asset] = await db.select().from(assets).where(eq(assets.id, assetId));

    if (!asset || asset.userId !== userId) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    if (asset.fileId) {
      await deleteFromImageKit(asset.fileId);
    }

    let storageFreed = 0;
    storageFreed = asset.fileSize;

    await db.delete(assets).where(eq(assets.id, assetId));

    await db
    .update(users)
    .set({
      storageUsed: sql`GREATEST(${users.storageUsed} - ${storageFreed}, 0)`
    })
    .where(eq(users.id, userId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE_ASSET_ERROR]", error);
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}
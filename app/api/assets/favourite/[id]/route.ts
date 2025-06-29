import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { assets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params before accessing properties
    const resolvedParams = await params;
    const assetId = resolvedParams.id;

    // Get current asset
    const [existing] = await db
      .select()
      .from(assets)
      .where(eq(assets.id, assetId));

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Toggle isFavorite
    const updated = await db
      .update(assets)
      .set({ isFavorite: !existing.isFavorite })
      .where(eq(assets.id, assetId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error("[ASSET_FAV_TOGGLE_ERROR]", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
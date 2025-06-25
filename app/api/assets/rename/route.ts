import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { assets } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { assetId, newName } = await req.json();

    if (!assetId || !newName) {
      return NextResponse.json({ error: "assetId and newName are required" }, { status: 400 });
    }

    const [asset] = await db
      .select()
      .from(assets)
      .where(and(eq(assets.id, assetId), eq(assets.userId, userId)));

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(assets)
      .set({ name: newName })
      .where(eq(assets.id, assetId))
      .returning();

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[ASSET_RENAME_ERROR]", error);
    return NextResponse.json({ error: "Failed to rename asset" }, { status: 500 });
  }
}
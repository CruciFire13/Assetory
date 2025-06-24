import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { sharedAccess, users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { assetId, sharedWithEmail } = await req.json();

    if (!assetId || !sharedWithEmail) {
      return NextResponse.json({ error: "assetId and sharedWithEmail required" }, { status: 400 });
    }

    // Look up target user by email
    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, sharedWithEmail));

    if (!targetUser) {
      return NextResponse.json({ error: "User to share with not found" }, { status: 404 });
    }

    // Check for existing share
    const existing = await db
        .select()
        .from(sharedAccess)
        .where(
        and(
            eq(sharedAccess.itemId, assetId),
            eq(sharedAccess.sharedWith, targetUser.id),
            eq(sharedAccess.type, "asset")
        )
        );
    
    if (existing.length > 0) {
          return NextResponse.json({ error: "Already shared" }, { status: 409 });
        }

    // Insert shared access record
    const sharedAsset = await db.insert(sharedAccess).values({
      sharedBy: userId,
      sharedWith: targetUser.id,
      itemId: assetId,
      type: "asset",
    }).returning();

    return NextResponse.json(sharedAsset[0], { status: 200 });
  } catch (error) {
    console.error("[SHARE_ASSET_ERROR]", error);
    return NextResponse.json({ error: "Failed to share asset" }, { status: 500 });
  }
}
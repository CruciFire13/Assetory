import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { sharedAccess, users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { folderId, sharedWithEmail } = await req.json();
    if (!folderId || !sharedWithEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, sharedWithEmail));
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for existing share
    const existing = await db
      .select()
      .from(sharedAccess)
      .where(
        and(
          eq(sharedAccess.itemId, folderId),
          eq(sharedAccess.sharedWith, targetUser.id),
          eq(sharedAccess.type, "folder")
        )
      );

    if (existing.length > 0) {
      return NextResponse.json({ error: "Already shared" }, { status: 409 });
    }

    const sharedFolder = await db.insert(sharedAccess).values({
      sharedBy: userId,
      sharedWith: targetUser.id,
      itemId: folderId,
      type: "folder",
    }).returning();

    return NextResponse.json(sharedFolder[0], { status: 200 });
  } catch (error) {
    console.error("[SHARE_FOLDER_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
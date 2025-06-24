import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { sharedAccess, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const unsharedFolder = await db
      .delete(sharedAccess)
      .where(
        and(
          eq(sharedAccess.sharedBy, userId),
          eq(sharedAccess.itemId, folderId),
          eq(sharedAccess.sharedWith, targetUser.id),
          eq(sharedAccess.type, "folder")
        )
      ).returning();

    return NextResponse.json(unsharedFolder[0], { status: 200 });
  } catch (err) {
    console.error("[UNSHARE_FOLDER_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to unshare folder" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { sharedAccess, users } from "@/lib/db/schema";
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

    const sharedUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        image: users.profileImageUrl,
      })
      .from(sharedAccess)
      .innerJoin(users, eq(sharedAccess.sharedWith, users.id))
      .where(
        and(
          eq(sharedAccess.itemId, folderId),
          eq(sharedAccess.type, "folder")
        )
      );

    return NextResponse.json({ sharedWith: sharedUsers }, { status: 200 });
  } catch (error) {
    console.error("[FOLDER_SHARED_USERS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch shared users" },
      { status: 500 }
    );
  }
}
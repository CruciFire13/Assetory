import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { folders } from "@/lib/db/schema";
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
    const folderId = resolvedParams.id;

    const [existing] = await db
      .select()
      .from(folders)
      .where(eq(folders.id, folderId));

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const updated = await db
      .update(folders)
      .set({ isTrashed: !existing.isTrashed })
      .where(eq(folders.id, folderId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error("[FOLDER_TRASH_TOGGLE_ERROR]", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
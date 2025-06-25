import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { folders } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { folderId, newName } = await req.json();

    if (!folderId || !newName) {
      return NextResponse.json({ error: "folderId and newName are required" }, { status: 400 });
    }

    const [folder] = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, userId)));

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(folders)
      .set({ name: newName })
      .where(eq(folders.id, folderId))
      .returning();

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[FOLDER_RENAME_ERROR]", error);
    return NextResponse.json({ error: "Failed to rename folder" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { folders } from "@/lib/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, parentName } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid folder name" }, { status: 400 });
    }

    let parentId: string | null = null;

    // If parentName is provided, look up that folder by name and userId
    if (parentName) {
      const [parentFolder] = await db
        .select()
        .from(folders)
        .where(
          and(
            eq(folders.name, parentName),
            eq(folders.userId, userId as string)
          )
        );

      if (!parentFolder) {
        return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
      }

      parentId = parentFolder.id;
    }

    // Check for duplicate folder name under the same parent
    const [existing] = await db
      .select()
      .from(folders)
      .where(
        and(
          eq(folders.name, name),
          eq(folders.userId, userId as string),
          parentId === null
          ? isNull(folders.parentId)
          : eq(folders.parentId, parentId)
        )
      );

    if (existing) {
      return NextResponse.json({ error: "A folder with that name already exists in the parent folder" }, { status: 409 });
    }

    const [newFolder] = await db
      .insert(folders)
      .values({
        name,
        parentId,
        userId,
      })
      .returning();

    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    console.error("[FOLDER_CREATE_ERROR]", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
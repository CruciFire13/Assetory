import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { folders } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { name, parentId } = await req.json();
  
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid folder name" }, { status: 400 });
    }
  
    const [newFolder] = await db
      .insert(folders)
      .values({
        name,
        parentId: parentId || null,
        userId,
      })
      .returning();
  
    return NextResponse.json(newFolder, { status: 201 });
  } catch(error) {
    console.error("[FOLDER_CREATE_ERROR]", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
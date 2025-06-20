import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { assets, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { imagekit } from "@/lib/imagekit";

// Allowed MIME types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/zip",
  "application/json",
  "text/html",
  "text/plain",
  "application/javascript",
  "text/css",
  "application/x-typescript",
];

// File size limits
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_USER_STORAGE = 2 * 1024 * 1024 * 1024; // 2 GB

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folderId = formData.get("folderId") as string | null;
  
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }
  
    const fileSize = file.size;
    const fileType = file.type;
    const fileName = file.name;
  
    // Check file type
    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${fileType}` },
        { status: 400 }
      );
    }
  
    // Check file size
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File exceeds max limit of 5MB` },
        { status: 400 }
      );
    }
  
    // Check user total storage
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const currentStorage = user?.storageUsed ?? 0;
  
    if (currentStorage + fileSize > MAX_USER_STORAGE) {
      return NextResponse.json(
        { error: "Storage quota exceeded (2GB)" },
        { status: 403 }
      );
    }
  
    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
  
    // Upload to ImageKit
    const uploaded = await imagekit.upload({
      file: buffer,
      fileName,
    });
  
    // Save asset in DB
    const [asset] = await db
      .insert(assets)
      .values({
        name: fileName,
        url: uploaded.url,
        fileType,
        fileSize,
        folderId: folderId || null,
        userId,
      })
      .returning();
  
    // Update user's storage used
    await db
      .update(users)
      .set({ storageUsed: currentStorage + fileSize })
      .where(eq(users.id, userId));
  
    return NextResponse.json(asset, { status: 201 });
  } catch(error) {
    console.error("[ASSET_UPLOAD_ERROR]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { assets, folders, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { imagekit } from "@/lib/imagekit";

// Allowed MIME types and extensions
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/json",
  "text/html",
  "text/plain",
  "application/javascript",
  "text/css",
  "application/x-typescript",
  "text/x-c++src",           // C++ (sometimes reported this way)
  "application/javascript",  // JSX fallback
  "application/x-jsx",       // JSX (nonstandard but sometimes reported)
  "application/x-tsx",       // TSX (nonstandard)
];
const ALLOWED_EXTENSIONS = [
  ".txt",        // plain text
  ".pdf",        // PDF files
  ".json",       // JSON
  ".html",       // HTML
  ".css",        // CSS
  ".js",         // JavaScript
  ".ts",         // TypeScript
  ".tsx",        // TSX
  ".jsx",        // JSX
  ".cpp",        // C++
  ".svg",        // SVG images
  ".jpg", ".jpeg", // JPEG
  ".png",        // PNG
  ".webp"        // WebP
];

// File size limits
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_USER_STORAGE = 2 * 1024 * 1024 * 1024; // 2 GB

function isExtensionAllowed(filename: string) {
  return ALLOWED_EXTENSIONS.some(ext => filename.toLowerCase().endsWith(ext));
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folderName = formData.get("folderName") as string | null;

    if (!file) return NextResponse.json({ error: "File is required" }, { status: 400 });

    const fileSize = file.size;
    const fileType = file.type;
    const fileName = file.name;

    // Reject zip files explicitly
    if (fileType === "application/zip" || fileName.endsWith(".zip")) {
      return NextResponse.json({ error: "ZIP files are not allowed" }, { status: 400 });
    }

    // Check MIME or fallback to extension check
    const isMimeAllowed = ALLOWED_TYPES.includes(fileType);
    const isExtAllowed = isExtensionAllowed(fileName);

    if (!isMimeAllowed && !isExtAllowed) {
      return NextResponse.json({ error: `Unsupported file type: ${fileType}` }, { status: 400 });
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File exceeds max limit of 5MB` }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const currentStorage = user?.storageUsed ?? 0;

    if (currentStorage + fileSize > MAX_USER_STORAGE) {
      return NextResponse.json({ error: "Storage quota exceeded (2GB)" }, { status: 403 });
    }

    // Get folder ID from name (if provided)
    let folderId: string | null = null;
    if (folderName) {
      const [folder] = await db
        .select()
        .from(folders)
        .where(
          and(
            eq(folders.name, folderName),
            eq(folders.userId, userId), 
          )
        );

      if (!folder) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404 });
      }

      folderId = folder.id;
    }

    // Upload to ImageKit
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await imagekit.upload({
      file: buffer,
      fileName,
    });

    // Save to DB
    const [asset] = await db
      .insert(assets)
      .values({
        name: fileName,
        url: uploaded.url,
        fileType,
        fileSize,
        folderId,
        userId,
        fileId: uploaded.fileId,
      })
      .returning();

    await db
      .update(users)
      .set({ storageUsed: currentStorage + fileSize })
      .where(eq(users.id, userId));

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("[ASSET_UPLOAD_ERROR]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
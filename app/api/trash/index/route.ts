import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { assets, folders } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [trashedAssets, trashedFolders] = await Promise.all([
      db.select().from(assets).where(and(eq(assets.userId, userId), eq(assets.isTrashed, true))),
      db.select().from(folders).where(and(eq(folders.userId, userId), eq(folders.isTrashed, true))),
    ]);

    return NextResponse.json({ assets: trashedAssets, folders: trashedFolders });
  } catch (err) {
    console.error("[TRASH_ERROR]", err);
    return NextResponse.json({ error: "Failed to fetch trash" }, { status: 500 });
  }
}
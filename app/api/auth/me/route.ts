import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const [user] = await db.select().from(users).where(eq(users.id, userId));

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({
            name: user.name,
            email: user.email,
            storageUsed: user.storageUsed,
            image: user.profileImageUrl,
        }, {status: 200});
    } catch (err) {
        console.error("[USER_STORAGE_FETCH_ERROR]", err);
        return NextResponse.json({ error: "Failed to fetch storage" }, { status: 500 });
    }
}
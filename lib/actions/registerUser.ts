import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const registerUser = async () => {
  const { userId } = await auth();
  if (!userId) return;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (existingUser.length > 0) return;

  // Get the clerk client instance first
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);

  const primaryEmail = clerkUser.emailAddresses.find(
    (email) => email.id === clerkUser.primaryEmailAddressId
  );

  // Ensure we have an email since it's required in the schema
  if (!primaryEmail?.emailAddress) {
    console.error("No primary email found for user:", clerkUser.id);
    return;
  }

  await db.insert(users).values({
    id: clerkUser.id,
    name: clerkUser.firstName || clerkUser.username || "User",
    email: primaryEmail.emailAddress, // Now guaranteed to exist
    profileImageUrl: clerkUser.imageUrl,
    // storageUsed will use the default value of 0
    // createdAt will use defaultNow()
  });

  console.log("User registered in DB:", clerkUser.id);
};

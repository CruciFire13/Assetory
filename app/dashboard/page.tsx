// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { registerUser } from "@/lib/actions/registerUser";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/SignIn"); // Redirect if not authenticated
  }

  await registerUser(); // Register user in DB if not already

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <p className="mt-4 text-gray-600">
        Your account is now synced with the database.
      </p>
    </main>
  );
}

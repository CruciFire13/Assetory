// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { registerUser } from "@/lib/actions/registerUser";
import { redirect } from "next/navigation";
import AssetUploader from "@/components/AssetUploader";
import FolderCreator from "@/components/FolderCreator";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  await registerUser();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard </h1>
      <p className="text-gray-600">
        Your account is now synced with the database.
      </p>

      <AssetUploader />
      <FolderCreator />
    </main>
  );
}

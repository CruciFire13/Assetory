import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { registerUser } from "@/lib/actions/registerUser";

import AssetUploader from "@/components/AssetUploader";
import FolderCreator from "@/components/FolderCreator";
import SignOutClientButton from "@/components/SignOutClientButton";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  await registerUser();

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
        <SignOutClientButton />
      </div>

      <p className="text-gray-600">
        Your account is now synced with the database.
      </p>

      <AssetUploader />
      <FolderCreator />
    </main>
  );
}

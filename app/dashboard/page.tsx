import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { registerUser } from "@/lib/actions/registerUser";

import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import AssetUploader from "@/components/AssetUploader";
import FolderCreator from "@/components/FolderCreator";
import SignOutClientButton from "@/components/SignOutClientButton";
import { AssetGrid } from "@/components/AssetGrid";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) return redirect("/sign-in");

  await registerUser();

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
            <SignOutClientButton />
          </div>
          <p className="text-gray-600">
            Your account is now synced with the database.
          </p>
          <AssetUploader />
          <FolderCreator />
          <AssetGrid />
        </main>
      </div>
    </div>
  );
}

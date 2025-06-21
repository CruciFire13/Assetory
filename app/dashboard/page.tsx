import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { AssetGrid } from "@/components/AssetGrid";
import AssetUploader from "@/components/AssetUploader";
import FolderCreator from "@/components/FolderCreator";
import SignOutClientButton from "@/components/SignOutClientButton";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) return redirect("/sign-in");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
            <SignOutClientButton />
          </div>

          <AssetUploader />
          <FolderCreator />
          <AssetGrid />
        </main>
      </div>
    </div>
  );
}

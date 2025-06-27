"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import AssetGrid from "@/components/AssetGrid";
import PopupUploader from "@/components/PopupUploader";
import SignOutClientButton from "@/components/SignOutClientButton";

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState<string>("Root");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleFolderClick = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setCurrentFolderName(folderName);
  };


  if (!isLoaded) return null;

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

          {/* Folder Info & Back Button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">{currentFolderName}</h2>
            </div>

            <PopupUploader
              defaultParentName={currentFolderId ? currentFolderName : ""}
              key={currentFolderId} // force re-render when folder changes
            />
          </div>

          <AssetGrid
            endpoint={
              currentFolderId
                ? `/api/folders/contents/${currentFolderId}`
                : `/api/folders/root`
            }
          />
        </main>
      </div>
    </div>
  );
}
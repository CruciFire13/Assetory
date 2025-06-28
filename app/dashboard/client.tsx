"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import AssetGrid from "@/components/AssetGrid";
import PopupUploader from "@/components/PopupUploader";
import SignOutClientButton from "@/components/SignOutClientButton";
import { motion } from "framer-motion";
import LogoReveal from "@/components/LogoReveal";

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState<string>("");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleFolderClick = (folderId: string, folderName: string) => {
    setCurrentFolderId(folderId);
    setCurrentFolderName(folderName);
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin h-12 w-12 border-4 border-pink-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-[#2a0a0a] via-[#3f0d0d] to-black text-white font-sans relative overflow-hidden">
      <div className="z-40 relative">
        <Sidebar />
      </div>

      <div className="fixed top-0 left-0 right-0 z-30">
        <Navbar />
      </div>

      <div className="pt-16 lg:ml-64 h-full flex flex-col relative z-20">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <LogoReveal />
        </div>

        <main className="p-6 space-y-6 overflow-y-auto relative flex-1 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center z-30 relative"
          >
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#ff6666] via-[#fca5a5] to-[#ffe6e6] bg-clip-text text-transparent">
              Welcome to Your Dashboard
            </h1>

            <SignOutClientButton />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-between items-center z-30 relative"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-pink-100 drop-shadow-sm">
                {currentFolderName || ""}
              </h2>
            </div>

            <PopupUploader
              defaultParentName={currentFolderId ? currentFolderName : ""}
              key={currentFolderId}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="z-20 relative"
          >
            <AssetGrid
              endpoint={
                currentFolderId
                  ? `/api/folders/contents/${currentFolderId}`
                  : `/api/folders/root`
              }
              onFolderClick={handleFolderClick}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

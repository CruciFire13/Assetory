"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AssetGrid from "@/components/AssetGrid";
import PopupUploader from "@/components/PopupUploader";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

import LogoReveal from "@/components/LogoReveal";
import { motion } from "framer-motion";
import { ArrowLeftCircle } from "lucide-react";

interface FolderPageClientProps {
  folderId: string;
}

interface FolderInfo {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
}

export default function FolderPageClient({ folderId }: FolderPageClientProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [folderInfo, setFolderInfo] = useState<FolderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const fetchFolderInfo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/folders/contents/${folderId}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setFolderInfo(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load folder");
      } finally {
        setLoading(false);
      }
    };

    fetchFolderInfo();
  }, [folderId]);

  const handleGoBack = () => {
    if (folderInfo?.parentId) {
      router.push(`/dashboard/folder/${folderInfo.parentId}`);
    } else {
      router.push("/dashboard");
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#2a0a0a] via-[#3f0d0d] to-black text-white">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-0">
          <Navbar />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="animate-spin h-12 w-12 border-4 border-red-400 border-t-transparent rounded-full" />
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#2a0a0a] via-[#3f0d0d] to-black text-white">
        <Sidebar />
        <div className="flex flex-col flex-1 min-h-0">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff6666] via-[#fca5a5] to-[#ffe6e6] text-transparent bg-clip-text">
                Folder Not Found
              </h1>
            </div>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-lg font-semibold mb-2">{error}</h3>
              <p className="text-muted-foreground mb-4">
                The folder doesn’t exist or you don’t have permission to access
                it.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-lg text-white shadow"
              >
                Go to Dashboard
              </button>
            </div>
          </main>
        </div>
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
            className="flex justify-between items-center"
          >
            <button
              onClick={handleGoBack}
              className="flex items-center text-sm text-pink-200 hover:text-pink-100 transition"
            >
              <ArrowLeftCircle className="w-5 h-5 mr-1" />
              Back
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-between items-center"
          >
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ff8a8a] to-[#ffe6e6] bg-clip-text text-transparent">
                {folderInfo?.name}
              </h2>
              {folderInfo?.createdAt && (
                <p className="text-sm text-white/60">
                  Created on:{" "}
                  {new Date(folderInfo.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <PopupUploader
              defaultParentName={folderInfo?.name}
              key={folderId}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AssetGrid endpoint={`/api/folders/contents/${folderId}`} />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

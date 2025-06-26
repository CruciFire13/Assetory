"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AssetGrid from "@/components/AssetGrid";
import PopupUploader from "@/components/PopupUploader";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import SignOutClientButton from "@/components/SignOutClientButton";

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

  const handleFolderClick = (clickedFolderId: string, folderName: string) => {
    router.push(`/dashboard/folder/${clickedFolderId}`);
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="p-6 space-y-6 overflow-y-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="p-6 space-y-6 overflow-y-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Folder Not Found</h1>
              <SignOutClientButton />
            </div>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
              <p className="text-gray-500 mb-4">
                The folder you're looking for doesn't exist or you don't have access to it.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors"
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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <button
              onClick={handleGoBack}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
            <SignOutClientButton />
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                {folderInfo?.name}
              </h2>
              {folderInfo?.createdAt && (
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(folderInfo.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <PopupUploader 
              defaultParentName={folderInfo?.name}
              key={folderId}
            />
          </div>

          <AssetGrid
            endpoint={`/api/folders/contents/${folderId}`}
            onFolderClick={handleFolderClick}
          />
        </main>
      </div>
    </div>
  );
}
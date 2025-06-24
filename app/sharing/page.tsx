"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import SignOutClientButton from "@/components/SignOutClientButton";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface SharedFolder {
  id: string;
  name: string;
  createdAt: string;
  sharedBy: string;
  sharedByName: string;
  sharedByEmail: string;
}

interface SharedAsset {
  id: string;
  name: string;
  fileType: string;
  url: string;
  fileSize: number;
  createdAt: string;
  sharedBy: string;
  sharedByName: string;
  sharedByEmail: string;
}

export default function SharedPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [folders, setFolders] = useState<SharedFolder[]>([]);
  const [assets, setAssets] = useState<SharedAsset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const fetchSharedItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/shared/index");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load shared items");
      }

      setFolders(data.folders || []);
      setAssets(data.assets || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch shared items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedItems();
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Items Shared With You</h1>
            <SignOutClientButton />
          </div>

          {/* Shared Folders */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Shared Folders</h2>
            {folders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No folders shared with you.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {folders.map((folder) => (
                  <motion.div
                    key={folder.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-md transition">
                      <CardContent className="p-4">
                        <CardTitle>{folder.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          📁 Folder
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Shared by: {folder.sharedByName} (
                          {folder.sharedByEmail})
                        </p>
                        <p className="text-xs text-gray-400">
                          Created:{" "}
                          {new Date(folder.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Shared Assets */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Shared Assets</h2>
            {assets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No assets shared with you.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover:shadow-md transition">
                      <CardContent className="p-4">
                        <CardTitle>{asset.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {asset.fileType}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Shared by: {asset.sharedByName} ({asset.sharedByEmail}
                          )
                        </p>
                        <p className="text-xs text-gray-400">
                          Uploaded:{" "}
                          {new Date(asset.createdAt).toLocaleDateString()}
                        </p>
                        {asset.fileType.startsWith("image/") ? (
                          <Image
                            src={asset.url}
                            alt={asset.name}
                            width={500}
                            height={200}
                            className="mt-2 w-full h-40 object-cover rounded border"
                          />
                        ) : (
                          <p className="text-xs text-gray-500 mt-2 truncate">
                            <a
                              href={asset.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              Open file
                            </a>
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

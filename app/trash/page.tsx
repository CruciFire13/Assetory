"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface Folder {
  id: string;
  name: string;
  createdAt?: string;
}

interface Asset {
  id: string;
  name: string;
  fileType: string;
  createdAt: string;
  url: string;
}

export default function TrashPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/trash/index");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load trash");

      setFolders(data.folders || []);
      setAssets(data.assets || []);
    } catch (err) {
      toast.error("Failed to load trash");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string, type: "folder" | "asset") => {
    try {
      const res = await fetch(`/api/${type}s/trash/${id}`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error();
      toast.success(`${type} restored`);
      fetchTrash();
    } catch {
      toast.error(`Failed to restore ${type}`);
    }
  };

  const handlePermanentDelete = async (
    id: string,
    type: "folder" | "asset"
  ) => {
    try {
      const res = await fetch(`/api/${type}s/permanent-delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success(`${type} permanently deleted`);
      fetchTrash();
    } catch {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to empty the trash?"
      );
      if (!confirmed) return;

      const res = await fetch("/api/trash/empty", { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Trash emptied");
      fetchTrash();
    } catch {
      toast.error("Failed to empty trash");
    }
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    fetchTrash();
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="p-6 space-y-6 overflow-y-auto">
          <h1 className="text-2xl font-bold">Trash</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...folders, ...assets].map((item: any) => {
              const isAsset = "fileType" in item;
              const type = isAsset ? "asset" : "folder";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition relative">
                    <CardContent className="p-4 space-y-2">
                      <CardTitle>{item.name}</CardTitle>
                      {isAsset && (
                        <>
                          <p className="text-sm text-muted-foreground">
                            {item.fileType}
                          </p>
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded border"
                          />
                        </>
                      )}
                      {item.createdAt && (
                        <p className="text-xs text-gray-400">
                          Deleted:{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      )}
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => handleRestore(item.id, type)}
                        >
                          Restore
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handlePermanentDelete(item.id, type)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {!loading && folders.length === 0 && assets.length === 0 && (
            <p className="text-gray-500 text-center pt-12">Trash is empty</p>
          )}
        </main>

        <div className="fixed bottom-6 right-6">
          <Button
            variant="destructive"
            size="lg"
            onClick={handleEmptyTrash}
            className="shadow-lg"
          >
            Empty Trash
          </Button>
        </div>
      </div>
    </div>
  );
}

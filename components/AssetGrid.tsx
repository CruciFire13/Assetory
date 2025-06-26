"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import MoreOptionsMenu from "@/components/ui/MoreOptionsMenu";
import { useRouter } from "next/navigation";

interface Folder {
  id: string;
  name: string;
  createdAt?: string;
  isFavorite?: boolean;
}

interface Asset {
  id: string;
  name: string;
  fileType: string;
  createdAt: string;
  url: string;
  isFavorite?: boolean;
}

interface Props {
  endpoint: string;
  showBreadcrumbs?: boolean;
}

const AssetGrid = ({ endpoint }: Props) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [enlargedAsset, setEnlargedAsset] = useState<Asset | null>(null);
  const router = useRouter();

  const fetchContents = async () => {
    try {
      setLoading(true);
      const res = await fetch(endpoint);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load contents");

      setFolders(data.folders || []);
      setAssets(data.assets || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load folder contents");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (id: string, type: "folder" | "asset") => {
    try {
      const res = await fetch(`/api/${type}s/favourite/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error();
      toast.success(`${type === "folder" ? "Folder" : "Asset"} updated`);
      fetchContents();
    } catch {
      toast.error("Failed to update favorite status");
    }
  };

  const handleTrash = async (id: string, type: "folder" | "asset") => {
    try {
      const res = await fetch(`/api/${type}s/trash/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error();
      toast.success(`${type === "folder" ? "Folder" : "Asset"} moved to trash`);
      fetchContents();
    } catch {
      toast.error("Failed to move to trash");
    }
  };

  useEffect(() => {
    fetchContents();
  }, [endpoint]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEnlargedAsset(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map((folder) => (
          <motion.div
            key={folder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer"
          >
            <Card
              className="hover:shadow-lg transition relative"
              onClick={() => router.push(`/dashboard/folder/${folder.id}`)}
            >
              <div className="absolute top-2 right-2 z-10">
                <MoreOptionsMenu
                  onFavorite={() => handleToggleFavorite(folder.id, "folder")}
                  onDelete={() => handleTrash(folder.id, "folder")}
                  itemId={folder.id}
                  itemType="folder"
                  itemName={folder.name}
                  isFavorite={folder.isFavorite}
                />
              </div>
              <CardContent className="p-4">
                <CardTitle>{folder.name}</CardTitle>
                <p className="text-sm text-muted-foreground">📁 Folder</p>
                {folder.createdAt && (
                  <p className="text-xs text-gray-400">
                    Created: {new Date(folder.createdAt).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {assets.map((asset) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition relative">
              <div className="absolute top-2 right-2 z-10">
                <MoreOptionsMenu
                  onFavorite={() => handleToggleFavorite(asset.id, "asset")}
                  onDelete={() => handleTrash(asset.id, "asset")}
                  onDownload={() => setEnlargedAsset(asset)}
                  itemId={asset.id}
                  itemType="asset"
                  itemName={asset.name}
                  isFavorite={asset.isFavorite}
                />
              </div>
              <CardContent className="p-4">
                <CardTitle>{asset.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {asset.fileType}
                </p>
                <p className="text-xs text-gray-400">
                  Uploaded: {new Date(asset.createdAt).toLocaleDateString()}
                </p>

                {asset.fileType.startsWith("image/") ? (
                  <div
                    onClick={() => setEnlargedAsset(asset)}
                    className="cursor-zoom-in"
                  >
                    <Image
                      src={asset.url}
                      alt={asset.name}
                      width={500}
                      height={200}
                      className="mt-2 w-full h-40 object-cover rounded border hover:brightness-90 transition"
                    />
                  </div>
                ) : asset.fileType.startsWith("video/") ? (
                  <video
                    controls
                    src={asset.url}
                    className="mt-2 w-full h-40 object-cover rounded border"
                  />
                ) : asset.fileType === "application/pdf" ? (
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-blue-500 underline text-sm"
                  >
                    View PDF
                  </a>
                ) : (
                  <p className="text-xs text-gray-500 mt-2 truncate">
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                      download
                    >
                      Download file
                    </a>
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {!loading && folders.length === 0 && assets.length === 0 && (
          <p className="col-span-full text-gray-500 text-center">
            No folders or assets found.
          </p>
        )}
      </div>

      {enlargedAsset && enlargedAsset.fileType.startsWith("image/") && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setEnlargedAsset(null)}
        >
          <img
            src={enlargedAsset.url}
            alt="Fullscreen"
            className="max-w-[90%] max-h-[90%] rounded shadow-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default AssetGrid;

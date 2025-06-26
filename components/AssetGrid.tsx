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
  onFolderClick?: (folderId: string, folderName: string) => void;
}

const AssetGrid = ({ endpoint, onFolderClick }: Props) => {
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

  const handleFolderClick = (folder: Folder) => {
    if (onFolderClick) {
      // Use the prop function for in-page navigation
      onFolderClick(folder.id, folder.name);
    } else {
      // Fallback to router navigation if no prop provided
      router.push(`/dashboard/folder/${folder.id}`);
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <Card>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

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
              className="hover:shadow-lg transition-all duration-200 relative group"
              onClick={() => handleFolderClick(folder)}
            >
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📁</span>
                  <CardTitle className="truncate">{folder.name}</CardTitle>
                  {folder.isFavorite && (
                    <span className="text-yellow-500 text-sm">⭐</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Folder</p>
                {folder.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
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
            <Card className="hover:shadow-lg transition-all duration-200 relative group">
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreOptionsMenu
                  onFavorite={() => handleToggleFavorite(asset.id, "asset")}
                  onDelete={() => handleTrash(asset.id, "asset")}
                  onDownload={() => window.open(asset.url, '_blank')}
                  itemId={asset.id}
                  itemType="asset"
                  itemName={asset.name}
                  isFavorite={asset.isFavorite}
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="truncate flex-1">{asset.name}</CardTitle>
                  {asset.isFavorite && (
                    <span className="text-yellow-500 text-sm">⭐</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {asset.fileType}
                </p>
                <p className="text-xs text-gray-400 mb-3">
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
                      className="w-full h-40 object-cover rounded border hover:brightness-90 transition"
                    />
                  </div>
                ) : asset.fileType.startsWith("video/") ? (
                  <video
                    controls
                    src={asset.url}
                    className="w-full h-40 object-cover rounded border"
                    preload="metadata"
                  />
                ) : asset.fileType === "application/pdf" ? (
                  <div className="border rounded p-4 text-center bg-red-50">
                    <span className="text-4xl">📄</span>
                    <p className="text-sm mt-2">PDF Document</p>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-blue-500 hover:text-blue-700 underline text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open PDF
                    </a>
                  </div>
                ) : (
                  <div className="border rounded p-4 text-center bg-gray-50">
                    <span className="text-4xl">📎</span>
                    <p className="text-sm mt-2 truncate">{asset.name}</p>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-blue-500 hover:text-blue-700 underline text-sm"
                      download
                      onClick={(e) => e.stopPropagation()}
                    >
                      Download
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {!loading && folders.length === 0 && assets.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No content found
            </h3>
            <p className="text-gray-500">
              This folder is empty. Upload some files or create new folders to get started.
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {enlargedAsset && enlargedAsset.fileType.startsWith("image/") && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setEnlargedAsset(null)}
        >
          <div className="relative max-w-[90%] max-h-[90%]">
            <button
              onClick={() => setEnlargedAsset(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </button>
            <img
              src={enlargedAsset.url}
              alt={enlargedAsset.name}
              className="max-w-full max-h-full rounded shadow-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b">
              <h3 className="font-medium">{enlargedAsset.name}</h3>
              <p className="text-sm text-gray-300">
                {new Date(enlargedAsset.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetGrid;
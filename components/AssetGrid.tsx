"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import MoreOptionsMenu from "@/components/ui/MoreOptionsMenu";
import { useRouter } from "next/navigation";

import {
  FaJs,
  FaReact,
  FaFilePdf,
  FaFileAlt,
  FaFileImage,
  FaFileVideo,
  FaFileCode,
  FaFileArchive,
} from "react-icons/fa";
import { PiFileCppFill } from "react-icons/pi";
import { SiTypescript, SiJson, SiPython } from "react-icons/si";
import { IconType } from "react-icons";

interface Folder {
  id: string;
  name: string;
  createdAt?: string;
  isFavorite?: boolean;
  sharedByName?: string;
  sharedByEmail?: string;
}

interface Asset {
  id: string;
  name: string;
  fileType: string;
  createdAt: string;
  url: string;
  isFavorite?: boolean;
  sharedByName?: string;
  sharedByEmail?: string;
}

interface Props {
  endpoint: string;
  showBreadcrumbs?: boolean;
  allowedActions?: Array<
    | "favorite"
    | "delete"
    | "rename"
    | "share"
    | "open"
    | "download"
    | "restore"
    | "permanentDelete"
  >;
  isTrashPage?: boolean;
  isSharedPage?: boolean;
}

const AssetGrid = ({
  endpoint,
  allowedActions,
  isTrashPage = false,
  isSharedPage = false,
}: Props) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [enlargedAsset, setEnlargedAsset] = useState<Asset | null>(null);
  const router = useRouter();

  const defaultActions: Props["allowedActions"] = isTrashPage
    ? ["restore", "permanentDelete"]
    : ["favorite", "delete", "rename", "share", "open", "download"];

  const actions = allowedActions || defaultActions;

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
      toast.success(`${type} moved to trash`);
      fetchContents();
    } catch {
      toast.error("Failed to move to trash");
    }
  };

  const handleRestore = async (id: string, type: "folder" | "asset") => {
    try {
      const res = await fetch(`/api/${type}s/trash/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error();
      toast.success(`${type} restored`);
      fetchContents();
    } catch {
      toast.error("Failed to restore item");
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
      fetchContents();
    } catch {
      toast.error("Failed to delete permanently");
    }
  };

  const handleFolderClick = (folder: Folder) => {
    if (actions.includes("open")) {
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

  const getIconForAsset = (asset: Asset): IconType => {
    const extension = asset.name.split(".").pop()?.toLowerCase() || "";

    if (asset.fileType.startsWith("image/")) return FaFileImage;
    if (asset.fileType.startsWith("video/")) return FaFileVideo;
    if (asset.fileType === "application/pdf") return FaFilePdf;

    switch (extension) {
      case "js":
      case "jsx":
        return FaJs;
      case "ts":
      case "tsx":
        return SiTypescript;
      case "json":
        return SiJson;
      case "cpp":
        return PiFileCppFill;
      case "py":
        return SiPython;
      case "zip":
      case "rar":
      case "tar":
        return FaFileArchive;
      case "md":
      case "txt":
        return FaFileAlt;
      default:
        return FaFileCode;
    }
  };

  return (
    <>
      {/* FOLDERS SECTION */}
      {folders.length > 0 && (
        <div className="col-span-full mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Folders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={actions.includes("open") ? "cursor-pointer" : ""}
              >
                <Card
                  className="hover:shadow-lg transition-all relative group"
                  onDoubleClick={() => handleFolderClick(folder)}
                >
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreOptionsMenu
                      itemId={folder.id}
                      itemType="folder"
                      itemName={folder.name}
                      isFavorite={folder.isFavorite}
                      onFavorite={() => handleToggleFavorite(folder.id, "folder")}
                      onDelete={() => handleTrash(folder.id, "folder")}
                      onRestore={() => handleRestore(folder.id, "folder")}
                      onPermanentDelete={() =>
                        handlePermanentDelete(folder.id, "folder")
                      }
                      allowedActions={actions}
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📁</span>
                      <CardTitle className="truncate flex-1">
                        {folder.name}
                      </CardTitle>
                      {folder.isFavorite && (
                        <span className="text-yellow-500 text-sm">⭐</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Folder</p>
                    {isSharedPage && folder.sharedByName && (
                      <p className="text-xs text-gray-500 mt-1">
                        Shared by: {folder.sharedByName} ({folder.sharedByEmail})
                      </p>
                    )}
                    {folder.createdAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Created: {new Date(folder.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ASSETS SECTION */}
      {assets.length > 0 && (
        <div className="col-span-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => {
              const IconComponent = getIconForAsset(asset);
              const extension = asset.name.split(".").pop()?.toLowerCase() || "";
              const bgColor = asset.fileType.startsWith("image/")
                ? "bg-blue-50"
                : "bg-gray-100";
              const textColor = asset.fileType.startsWith("image/")
                ? "text-blue-700"
                : "text-gray-700";
              const viewLink = asset.url;

              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-all relative group">
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreOptionsMenu
                        itemId={asset.id}
                        itemType="asset"
                        itemName={asset.name}
                        isFavorite={asset.isFavorite}
                        onFavorite={() => handleToggleFavorite(asset.id, "asset")}
                        onDelete={() => handleTrash(asset.id, "asset")}
                        onDownload={() => window.open(asset.url, "_blank")}
                        onRestore={() => handleRestore(asset.id, "asset")}
                        onPermanentDelete={() =>
                          handlePermanentDelete(asset.id, "asset")
                        }
                        allowedActions={actions}
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className="w-5 h-5 text-blue-500" />
                        <CardTitle className="truncate flex-1">
                          {asset.name}
                        </CardTitle>
                        {asset.isFavorite && (
                          <span className="text-yellow-500 text-sm">⭐</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        Uploaded: {new Date(asset.createdAt).toLocaleDateString()}
                      </p>
                      {isSharedPage && asset.sharedByName && (
                        <p className="text-xs text-gray-500 mb-2">
                          Shared by: {asset.sharedByName} ({asset.sharedByEmail})
                        </p>
                      )}
                      <div
                        className={`${bgColor} border rounded p-4 text-center cursor-pointer`}
                        onClick={() => {
                          if (asset.fileType.startsWith("image/")) {
                            setEnlargedAsset(asset);
                          } else {
                            window.open(asset.url, "_blank");
                          }
                        }}
                      >
                        <span className={`text-4xl ${textColor}`}>
                          <IconComponent />
                        </span>
                        <p className={`text-sm mt-2 truncate ${textColor}`}>
                          {asset.name}
                        </p>
                        <span className="inline-block mt-1 rounded bg-gray-200 text-gray-700 text-xs px-2 py-1">
                          .{extension}
                        </span>
                        <div className="mt-2 flex justify-center gap-2">
                          <a
                            href={viewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 underline text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View
                          </a>
                          <a
                            href={asset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="text-green-600 hover:text-green-800 underline text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && folders.length === 0 && assets.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isTrashPage
              ? "Trash is empty"
              : isSharedPage
              ? "No shared items"
              : "No content found"}
          </h3>
          <p className="text-gray-500">
            {isTrashPage
              ? "You have no items in the trash."
              : isSharedPage
              ? "Nothing has been shared with you yet."
              : "Upload some files or create new folders to get started."}
          </p>
        </div>
      )}

      {/* IMAGE FULLSCREEN MODAL */}
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
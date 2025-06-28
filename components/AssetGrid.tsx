"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  FaJs,
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

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import MoreOptionsMenu from "@/components/ui/MoreOptionsMenu";

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

  const getIconForAsset = (asset: Asset): IconType => {
    const ext = asset.name.split(".").pop()?.toLowerCase() || "";

    if (asset.fileType.startsWith("image/")) return FaFileImage;
    if (asset.fileType.startsWith("video/")) return FaFileVideo;
    if (asset.fileType === "application/pdf") return FaFilePdf;

    switch (ext) {
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
      {folders.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-[#ff8a8a] to-[#ffe6e6] text-transparent bg-clip-text mb-4 drop-shadow-sm">
            Folders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  onDoubleClick={() => handleFolderClick(folder)}
                  className="relative group cursor-pointer hover:shadow-xl transition"
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <MoreOptionsMenu
                      itemId={folder.id}
                      itemType="folder"
                      itemName={folder.name}
                      isFavorite={folder.isFavorite}
                      onFavorite={() =>
                        handleToggleFavorite(folder.id, "folder")
                      }
                      onDelete={() => handleTrash(folder.id, "folder")}
                      onRestore={() => handleRestore(folder.id, "folder")}
                      onPermanentDelete={() =>
                        handlePermanentDelete(folder.id, "folder")
                      }
                      allowedActions={actions}
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📁</span>
                      <CardTitle className="truncate">{folder.name}</CardTitle>
                      {folder.isFavorite && (
                        <span className="text-yellow-500">⭐</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Folder</p>
                    {folder.createdAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Created:{" "}
                        {new Date(folder.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    {isSharedPage && folder.sharedByName && (
                      <p className="text-xs text-gray-500 mt-1">
                        Shared by: {folder.sharedByName} ({folder.sharedByEmail}
                        )
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {assets.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-[#ff8a8a] to-[#ffe6e6] text-transparent bg-clip-text mb-4 drop-shadow-sm">
            Assets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => {
              const Icon = getIconForAsset(asset);
              const ext = asset.name.split(".").pop();
              const isImage = asset.fileType.startsWith("image/");

              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="relative group hover:shadow-xl transition">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <MoreOptionsMenu
                        itemId={asset.id}
                        itemType="asset"
                        itemName={asset.name}
                        isFavorite={asset.isFavorite}
                        onFavorite={() =>
                          handleToggleFavorite(asset.id, "asset")
                        }
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
                        <Icon className="text-blue-600 w-5 h-5" />
                        <CardTitle className="truncate flex-1">
                          {asset.name}
                        </CardTitle>
                        {asset.isFavorite && (
                          <span className="text-yellow-500">⭐</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        Uploaded:{" "}
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </p>
                      {isSharedPage && asset.sharedByName && (
                        <p className="text-xs text-gray-500 mt-1">
                          Shared by: {asset.sharedByName} ({asset.sharedByEmail}
                          )
                        </p>
                      )}
                      <div
                        className="mt-3 p-4 rounded border bg-gray-50 text-center cursor-pointer"
                        onClick={() =>
                          isImage
                            ? setEnlargedAsset(asset)
                            : window.open(asset.url, "_blank")
                        }
                      >
                        <Icon className="text-4xl text-blue-500 mx-auto" />
                        <p className="text-sm mt-2 truncate text-gray-700">
                          {asset.name}
                        </p>
                        <span className="inline-block mt-1 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                          .{ext}
                        </span>
                        <div className="mt-2 flex justify-center gap-3">
                          <a
                            href={asset.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View
                          </a>
                          <a
                            href={asset.url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 text-sm hover:underline"
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
        </section>
      )}

      {!loading && folders.length === 0 && assets.length === 0 && (
        <div className="text-center mt-16">
          <div className="text-6xl mb-4">🗃️</div>
          <h3 className="text-xl font-semibold mb-2">
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
              : "Upload files or create folders to get started."}
          </p>
        </div>
      )}

      {enlargedAsset && enlargedAsset.fileType.startsWith("image/") && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gradient-to-br from-red-900 via-red-800 to-red-700 bg-opacity-95"
          onClick={() => setEnlargedAsset(null)}
        >
          <div className="relative max-w-[90%] max-h-[90%]">
            <button
              className="absolute top-2 right-2 text-white text-2xl hover:text-red-300"
              onClick={() => setEnlargedAsset(null)}
            >
              ✕
            </button>
            <Image
              src={enlargedAsset.url}
              alt={enlargedAsset.name}
              width={1000}
              height={1000}
              className="max-w-full max-h-full rounded shadow-lg border border-white/20"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-black bg-opacity-60 text-white text-center rounded-b">
              <h3 className="font-medium">{enlargedAsset.name}</h3>
              <p className="text-sm">
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

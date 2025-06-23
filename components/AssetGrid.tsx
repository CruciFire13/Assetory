"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

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

interface Props {
  currentFolderId: string | null;
  onFolderClick: (folderId: string) => void;
}

const AssetGrid = ({ currentFolderId, onFolderClick }: Props) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);

  const fetchContents = async () => {
    try {
      const endpoint = currentFolderId
        ? `/api/folders/contents/${currentFolderId}`
        : `/api/folders/root`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load contents");
      }

      setFolders(data.folders || []);
      setAssets(data.assets || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load folder contents");
    }
  };

  useEffect(() => {
    fetchContents();
  }, [currentFolderId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {folders.map((folder) => (
        <motion.div
          key={folder.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => onFolderClick(folder.id)}
          className="cursor-pointer"
        >
          <Card className="hover:shadow-lg transition">
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
          <Card className="hover:shadow-lg transition">
            <CardContent className="p-4">
              <CardTitle>{asset.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{asset.fileType}</p>
              <p className="text-xs text-gray-400">
                Uploaded: {new Date(asset.createdAt).toLocaleDateString()}
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

      {folders.length === 0 && assets.length === 0 && (
        <p className="col-span-full text-gray-500">
          No folders or assets here.
        </p>
      )}
    </div>
  );
};

export default AssetGrid;

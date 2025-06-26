"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Star,
  Trash2,
  Share2,
  Pencil,
  Eye,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ShareModal from "@/components/ui/ShareModal";
import { toast } from "sonner";

export default function MoreOptionsMenu({
  onFavorite,
  onDelete,
  onDownload,
  itemId,
  itemType,
  itemName,
  isFavorite,
}: {
  onFavorite: () => void;
  onDelete: () => void;
  onDownload?: () => void;
  itemId: string;
  itemType: "asset" | "folder";
  itemName?: string;
  isFavorite?: boolean;
}) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleRename = async () => {
    const newName = prompt("Enter new name", itemName);
    if (!newName || newName === itemName) return;

    const url =
      itemType === "asset" ? "/api/assets/rename" : "/api/folders/rename";
    const payload =
      itemType === "asset"
        ? { assetId: itemId, newName }
        : { folderId: itemId, newName };

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to rename");

      toast.success(`Renamed ${itemType} successfully`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleDownload = () => {
    if (itemType === "asset" && onDownload) {
      onDownload(); // ✅ Trigger fullscreen view in AssetGrid
    } else {
      window.open(`/dashboard/${itemType}/${itemId}`, "_blank");
    }
  };

  const handleOpen = () => {
    if (itemType === "folder") {
      router.push(`/dashboard/folder/${itemId}`);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" asChild>
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DropdownMenuItem onClick={onFavorite}>
              <Star className="w-4 h-4 mr-2" />
              {isFavorite ? "Unfavorite" : "Favorite"}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Move to Trash
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowModal(true)}>
              <Share2 className="w-4 h-4 mr-2" />
              Share via Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRename}>
              <Pencil className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            {itemType === "folder" && (
              <DropdownMenuItem onClick={handleOpen}>
                <Eye className="w-4 h-4 mr-2" />
                Open
              </DropdownMenuItem>
            )}
            {itemType === "asset" && (
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
            )}
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>

      <ShareModal
        open={showModal}
        onClose={() => setShowModal(false)}
        itemId={itemId}
        itemType={itemType}
      />
    </>
  );
}

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
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ShareModal from "@/components/ui/ShareModal";
import RenameModal from "@/components/ui/renameModal";
import { toast } from "sonner";

export default function MoreOptionsMenu({
  onFavorite,
  onDelete,
  onDownload,
  onRestore,
  onPermanentDelete,
  itemId,
  itemType,
  itemName,
  isFavorite,
  allowedActions = ["favorite", "delete", "rename", "share", "open", "download"],
  onRenamed,
}: {
  onFavorite?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onRestore?: () => void;
  onPermanentDelete?: () => void;
  itemId: string;
  itemType: "asset" | "folder";
  itemName?: string;
  isFavorite?: boolean;
  allowedActions?: Array<
    | "favorite"
    | "delete"
    | "share"
    | "rename"
    | "open"
    | "download"
    | "restore"
    | "permanentDelete"
  >;
  onRenamed?: () => void;
}) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const router = useRouter();

  const handleDownload = () => {
    if (itemType === "asset" && onDownload) {
      onDownload();
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
            {allowedActions.includes("favorite") && (
              <DropdownMenuItem onClick={onFavorite}>
                <Star className="w-4 h-4 mr-2" />
                {isFavorite ? "Unfavorite" : "Favorite"}
              </DropdownMenuItem>
            )}

            {allowedActions.includes("delete") && (
              <DropdownMenuItem onClick={onDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Move to Trash
              </DropdownMenuItem>
            )}

            {allowedActions.includes("restore") && (
              <DropdownMenuItem onClick={onRestore}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Restore
              </DropdownMenuItem>
            )}

            {allowedActions.includes("permanentDelete") && (
              <DropdownMenuItem onClick={onPermanentDelete}>
                <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                Delete Permanently
              </DropdownMenuItem>
            )}

            {allowedActions.includes("share") && itemType === "asset" && (
              <DropdownMenuItem onClick={() => setShowShareModal(true)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share via Email
              </DropdownMenuItem>
            )}

            {allowedActions.includes("rename") && (
              <DropdownMenuItem onClick={() => setShowRenameModal(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
            )}

            {allowedActions.includes("open") && itemType === "folder" && (
              <DropdownMenuItem onClick={handleOpen}>
                <Eye className="w-4 h-4 mr-2" />
                Open
              </DropdownMenuItem>
            )}

            {allowedActions.includes("download") && itemType === "asset" && (
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
            )}
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>

      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        itemId={itemId}
        itemType={itemType}
      />

      <RenameModal
        open={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        itemId={itemId}
        itemType={itemType}
        currentName={itemName || ""}
        onRenamed={onRenamed || (() => toast.success("Rename complete!"))}
      />
    </>
  );
}
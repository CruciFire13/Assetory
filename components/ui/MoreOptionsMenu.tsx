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
  allowedActions = [
    "favorite",
    "delete",
    "rename",
    "share",
    "open",
    "download",
  ],
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
          <button className="absolute top-2 right-2 p-1 rounded-full bg-transparent hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5 text-white/70 hover:text-pink-400 transition-colors" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 bg-[#1f1f1f] border border-pink-600/20 rounded-lg shadow-lg"
          asChild
        >
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {allowedActions.includes("favorite") && (
              <DropdownMenuItem
                onClick={onFavorite}
                className="text-white/80 hover:bg-pink-600/20 hover:text-pink-400 cursor-pointer"
              >
                <Star className="w-4 h-4 mr-2" />
                {isFavorite ? "Unfavorite" : "Favorite"}
              </DropdownMenuItem>
            )}

            {allowedActions.includes("delete") && (
              <DropdownMenuItem
                onClick={onDelete}
                className="text-white/80 hover:bg-pink-600/20 hover:text-pink-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Move to Trash
              </DropdownMenuItem>
            )}

            {allowedActions.includes("restore") && (
              <DropdownMenuItem
                onClick={onRestore}
                className="text-white/80 hover:bg-green-600/20 hover:text-green-400 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Restore
              </DropdownMenuItem>
            )}

            {allowedActions.includes("permanentDelete") && (
              <DropdownMenuItem
                onClick={onPermanentDelete}
                className="text-red-400 hover:bg-red-600/20 hover:text-red-300 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Permanently
              </DropdownMenuItem>
            )}

            {allowedActions.includes("share") && itemType === "asset" && (
              <DropdownMenuItem
                onClick={() => setShowShareModal(true)}
                className="text-white/80 hover:bg-blue-600/20 hover:text-blue-400 cursor-pointer"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share via Email
              </DropdownMenuItem>
            )}

            {allowedActions.includes("rename") && (
              <DropdownMenuItem
                onClick={() => setShowRenameModal(true)}
                className="text-white/80 hover:bg-yellow-600/20 hover:text-yellow-300 cursor-pointer"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
            )}

            {allowedActions.includes("open") && itemType === "folder" && (
              <DropdownMenuItem
                onClick={handleOpen}
                className="text-white/80 hover:bg-purple-600/20 hover:text-purple-300 cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-2" />
                Open
              </DropdownMenuItem>
            )}

            {allowedActions.includes("download") && itemType === "asset" && (
              <DropdownMenuItem
                onClick={handleDownload}
                className="text-white/80 hover:bg-cyan-600/20 hover:text-cyan-300 cursor-pointer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
            )}
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modals */}
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

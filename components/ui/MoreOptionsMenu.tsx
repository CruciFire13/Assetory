"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Star, Trash2, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function MoreOptionsMenu({
  onFavorite,
  onDelete,
  itemId,
  itemType,
}: {
  onFavorite: () => void;
  onDelete: () => void;
  itemId: string;
  itemType: "asset" | "folder";
}) {
  const handleShare = async () => {
    const email = prompt("Enter the email to share with:");
    if (!email) return;

    const isAsset = itemType === "asset";
    const url = isAsset ? "/api/assets/share" : "/api/folders/share";

    const body = isAsset
      ? { assetId: itemId, sharedWithEmail: email }
      : { folderId: itemId, sharedWithEmail: email };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");
      toast.success(`Shared ${itemType} with ${email}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to share");
    }
  };


  return (
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
            Favorite
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Move to Trash
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share via Email
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

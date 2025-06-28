"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function RenameModal({
  open,
  onClose,
  itemId,
  itemType,
  currentName,
  onRenamed,
}: {
  open: boolean;
  onClose: () => void;
  itemId: string;
  itemType: "asset" | "folder";
  currentName: string;
  onRenamed: () => void;
}) {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (open) {
      setNewName(currentName);
    }
  }, [open, currentName]);

  const handleRename = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (newName === currentName) {
      toast.info("Name is unchanged.");
      onClose();
      return;
    }

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

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Rename failed.");

      toast.success(`${itemType} renamed successfully!`);
      onRenamed();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#2a0a0a]/60 backdrop-blur-md border border-red-800/30 text-white shadow-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg text-white">
            Rename {itemType}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 items-center mt-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`Enter new ${itemType} name`}
            className="w-full px-4 py-2 bg-[#3a0a0a]/30 text-white placeholder:text-white/70 border border-red-800/20 rounded-xl shadow-inner backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleRename();
              }
            }}
          />
          <Button
            onClick={handleRename}
            className="bg-red-700 hover:bg-red-600 text-white rounded-xl"
          >
            Enter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

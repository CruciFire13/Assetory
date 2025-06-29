"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface SharedUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

export default function ShareModal({
  open,
  onClose,
  itemId,
  itemType,
}: {
  open: boolean;
  onClose: () => void;
  itemId: string;
  itemType: "asset" | "folder";
}) {
  const [email, setEmail] = useState("");
  const [sharedWith, setSharedWith] = useState<SharedUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSharedUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        itemType === "asset"
          ? `/api/assets/shared-users/${itemId}`
          : `/api/folders/shared-users/${itemId}`
      );
      if (!res.ok) throw new Error("Failed to fetch shared users");

      const data = await res.json();
      setSharedWith(data.sharedWith || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong fetching users.");
      }
    } finally {
      setLoading(false);
    }
  }, [itemType, itemId]);

  useEffect(() => {
    if (open) {
      fetchSharedUsers();
    }
  }, [open, fetchSharedUsers]);

  const handleShare = async () => {
    if (!email) return toast.error("Please enter a valid email");

    const url =
      itemType === "asset" ? "/api/assets/share" : "/api/folders/share";
    const body =
      itemType === "asset"
        ? { assetId: itemId, sharedWithEmail: email }
        : { folderId: itemId, sharedWithEmail: email };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to share");

      toast.success(`Shared ${itemType} with ${email}`);
      setEmail("");
      fetchSharedUsers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error sharing item");
      }
    }
  };

  const handleUnshare = async (emailToRemove: string) => {
    const url =
      itemType === "asset" ? "/api/assets/unshare" : "/api/folders/unshare";
    const body =
      itemType === "asset"
        ? { assetId: itemId, sharedWithEmail: emailToRemove }
        : { folderId: itemId, sharedWithEmail: emailToRemove };

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to unshare");

      toast.success(`Unshared ${emailToRemove}`);
      fetchSharedUsers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Error unsharing item");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#2a0a0a]/60 backdrop-blur-md border border-red-800/30 text-white shadow-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg text-white">
            Share {itemType}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-[#3a0a0a]/30 text-white placeholder:text-white/70 border border-red-800/20 rounded-xl shadow-inner backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          />
          <Button
            onClick={handleShare}
            className="bg-red-700 hover:bg-red-600 text-white rounded-xl"
          >
            Share
          </Button>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-white mb-2">Shared With:</p>
          {loading ? (
            <p className="text-sm text-white/60">Loading...</p>
          ) : sharedWith.length === 0 ? (
            <p className="text-sm text-white/60">No users shared yet.</p>
          ) : (
            <ul className="space-y-2 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-black/70 scrollbar-track-transparent pr-1">
              {sharedWith.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center px-3 py-2 bg-[#3a0a0a]/30 backdrop-blur-md border border-red-800/20 rounded-xl text-white"
                >
                  <div className="flex items-center gap-2">
                    {user.image && (
                      <Image
                        src={user.image}
                        alt={user.name || user.email}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex flex-col max-w-[160px]">
                      <span className="font-medium text-sm truncate">
                        {user.name || user.email}
                      </span>
                      {user.name && (
                        <span className="text-xs text-white/60 truncate">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleUnshare(user.email)}
                    className="text-xs"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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

  const fetchSharedUsers = async () => {
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
    } catch (err: any) {
      toast.error(err.message || "Something went wrong fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSharedUsers();
    }
  }, [open, itemId, itemType]);

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
    } catch (err: any) {
      toast.error(err.message || "Error sharing item");
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
    } catch (err: any) {
      toast.error(err.message || "Error unsharing item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {itemType}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleShare}>Share</Button>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Shared With:</p>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : sharedWith.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No users shared yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {sharedWith.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center px-3 py-2 border rounded"
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
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {user.name || user.email}
                      </span>
                      {user.name && (
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleUnshare(user.email)}
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

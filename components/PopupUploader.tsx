"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ButtonCardInput from "@/components/ui/ButtonCardInput";
import { Loader2 } from "lucide-react";

const MAX_FILE_SIZE_MB = 5;

interface PopupUploaderProps {
  defaultParentName?: string;
}

export default function PopupUploader({
  defaultParentName = "",
}: PopupUploaderProps) {
  const { getToken } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [targetFolderName, setTargetFolderName] = useState(defaultParentName);
  const [newFolderName, setNewFolderName] = useState("");
  const [parentName, setParentName] = useState(defaultParentName);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    setTargetFolderName(defaultParentName);
    setParentName(defaultParentName);
  }, [defaultParentName]);

  const handleUpload = async () => {
    if (!file) return toast.error("No file selected");
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
      return toast.error("File exceeds 5MB limit");

    setIsUploading(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("file", file);
      if (targetFolderName) formData.append("folderName", targetFolderName);

      const res = await fetch("/api/assets/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("File uploaded successfully!");
        setFile(null);
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return toast.error("Folder name is required");

    setIsCreatingFolder(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/folders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newFolderName.trim(),
          parentName: parentName || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Folder created successfully!");
        setNewFolderName("");
      } else {
        toast.error(data.error || "Error creating folder");
      }
    } catch {
      toast.error("Error creating folder");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-gradient-to-r from-[#7f1d1d] via-[#b91c1c] to-[#dc2626] hover:from-[#991b1b] hover:to-[#f87171] text-white px-4 py-2 rounded-md shadow transition-all font-semibold">
        + Add New
      </DialogTrigger>

      <DialogContent className="max-w-md bg-zinc-900 text-white border border-zinc-700 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-white text-lg tracking-wide">
            Manage Your Assets
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs defaultValue="upload" className="mt-4">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-zinc-800 text-white rounded-md">
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md transition"
              >
                Upload Asset
              </TabsTrigger>
              <TabsTrigger
                value="folder"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md transition"
              >
                Create Folder
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <ButtonCardInput
                label="Choose File"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <ButtonCardInput
                label="Target Folder (optional)"
                placeholder="Enter folder name"
                value={targetFolderName}
                onChange={(e) => setTargetFolderName(e.target.value)}
              />

              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-2 rounded-md shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </TabsContent>

            <TabsContent value="folder" className="space-y-4">
              <ButtonCardInput
                label="New Folder Name"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />

              <ButtonCardInput
                label="Parent Folder (optional)"
                placeholder="Enter parent folder"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
              />

              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim() || isCreatingFolder}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 rounded-md shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingFolder && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isCreatingFolder ? "Creating..." : "Create Folder"}
              </button>
            </TabsContent>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

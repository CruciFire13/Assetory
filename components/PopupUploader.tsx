"use client";

import { useState } from "react";
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

const MAX_FILE_SIZE_MB = 5;

export default function PopupUploader() {
  const { getToken } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [folderId, setFolderId] = useState("");

  const [folderName, setFolderName] = useState("");
  const [parentId, setParentId] = useState("");

  const handleUpload = async () => {
    if (!file) return toast.error("No file selected");
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
      return toast.error("File exceeds 5MB limit");

    const token = await getToken();
    const formData = new FormData();
    formData.append("file", file);
    if (folderId) formData.append("folderId", folderId);

    const res = await fetch("/api/assets/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("File uploaded!");
    } else {
      toast.error(data.error || "Upload failed");
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName) return toast.error("Folder name is required");

    const token = await getToken();
    const res = await fetch("/api/folders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: folderName, parentId: parentId || null }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Folder Created!");
    } else {
      toast.error(data.error || "Error creating Folder!");
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-primary text-white px-4 py-2 rounded shadow">
        + Add New
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="text-xl font-semibold">
            <DialogTitle>Manage Assets</DialogTitle>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs defaultValue="upload" className="mt-4">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upload">Upload Asset</TabsTrigger>
              <TabsTrigger value="folder">Create Folder</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <ButtonCardInput
                label="Choose File"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <ButtonCardInput
                label="Target Folder ID (optional)"
                placeholder="Enter Folder ID"
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
              />

              <button
                onClick={handleUpload}
                className="w-full bg-green-600 hover:bg-green-700 transition text-white py-2 rounded shadow"
              >
                Upload
              </button>
            </TabsContent>

            <TabsContent value="folder" className="space-y-4">
              <ButtonCardInput
                label="Folder Name"
                placeholder="Enter Folder Name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />

              <ButtonCardInput
                label="Parent Folder ID (optional)"
                placeholder="Enter Parent Folder ID"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              />

              <button
                onClick={handleCreateFolder}
                className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded shadow"
              >
                Create Folder
              </button>
            </TabsContent>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

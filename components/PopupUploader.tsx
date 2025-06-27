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
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
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
          parentName: parentName || null 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Folder created successfully!");
        setNewFolderName("");
      } else {
        toast.error(data.error || "Error creating folder");
      }
    } catch (error) {
      toast.error("Error creating folder");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors">
        + Add New
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Assets</DialogTitle>
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

            {/* Upload Asset Tab */}
            <TabsContent value="upload" className="space-y-4">
              <ButtonCardInput
                label="Choose File"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <ButtonCardInput
                label="Target Folder Name (optional)"
                placeholder="Enter target folder name"
                value={targetFolderName}
                onChange={(e) => setTargetFolderName(e.target.value)}
              />

              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors text-white py-2 rounded shadow"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </TabsContent>

            {/* Create Folder Tab */}
            <TabsContent value="folder" className="space-y-4">
              <ButtonCardInput
                label="Folder Name"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />

              <ButtonCardInput
                label="Parent Folder Name (optional)"
                placeholder="Enter parent folder name"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
              />

              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim() || isCreatingFolder}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors text-white py-2 rounded shadow"
              >
                {isCreatingFolder ? "Creating..." : "Create Folder"}
              </button>
            </TabsContent>
          </Tabs>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
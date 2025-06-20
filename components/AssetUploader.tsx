"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

const MAX_FILE_SIZE_MB = 5;

export default function AssetUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [folderId, setFolderId] = useState("");
  const { getToken } = useAuth();

  const handleUpload = async () => {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error("File exceeds 5MB limit");
      return;
    }

    const token = await getToken();
    const formData = new FormData();
    formData.append("file", file);
    if (folderId) formData.append("folderId", folderId);

    const res = await fetch("/api/assets/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("File uploaded!");
      console.log("📄 Uploaded:", data);
    } else {
      toast.error(data.error || "Upload failed");
    }
  };

  return (
    <div className="p-4 border rounded space-y-3 mt-6">
      <h3 className="font-semibold text-lg">📄 Upload Asset</h3>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border px-3 py-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Target Folder ID (optional)"
        value={folderId}
        onChange={(e) => setFolderId(e.target.value)}
        className="border px-3 py-2 w-full rounded"
      />
      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>
    </div>
  );
}

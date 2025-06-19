"use client";

import { useState, DragEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleUpload = () => {
    console.log("Uploading files:", files);
    // 🔒 Here, integrate with backend (API or storage service like ImageKit, S3, etc.)
  };

  return (
    <motion.div
      className="border-2 border-dashed border-gray-300 p-6 rounded-2xl w-full max-w-xl bg-white shadow-lg"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <UploadCloud className="w-10 h-10 text-gray-500" />
        <p className="text-gray-600">Drag & drop files or folders here</p>

        <Input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full"
        />

        <Button onClick={handleUpload} className="w-full mt-4">
          Upload Files
        </Button>

        {files.length > 0 && (
          <ul className="mt-4 w-full text-left text-sm text-gray-700">
            {files.map((file, index) => (
              <li key={index} className="truncate">
                📁 {file.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

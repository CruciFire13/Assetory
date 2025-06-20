"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

export default function FolderCreator() {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const { getToken } = useAuth();

  const handleCreate = async () => {
    if (!name) {
      toast.error("Folder name is required");
      return;
    }

    const token = await getToken();
    const res = await fetch("/api/folders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, parentId: parentId || null }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Folder created!");
      console.log("📁 Created:", data);
    } else {
      toast.error(data.error || "Error creating folder");
    }
  };

  return (
    <div className="p-4 border rounded space-y-3">
      <h3 className="font-semibold text-lg">📁 Create Folder</h3>
      <input
        type="text"
        placeholder="Folder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-3 py-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Parent Folder ID (optional)"
        value={parentId}
        onChange={(e) => setParentId(e.target.value)}
        className="border px-3 py-2 w-full rounded"
      />
      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </div>
  );
}

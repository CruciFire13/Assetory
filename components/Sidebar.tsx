"use client";

import { Button } from "@/components/ui/button";
import { FolderPlus, Upload } from "lucide-react";

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 border-r h-full p-4 space-y-4">
      <h2 className="text-lg font-medium">Navigation</h2>
      <Button className="w-full" variant="secondary">
        <Upload className="mr-2 h-4 w-4" />
        Upload Asset
      </Button>
      <Button className="w-full" variant="secondary">
        <FolderPlus className="mr-2 h-4 w-4" />
        Create Folder
      </Button>
    </aside>
  );
};

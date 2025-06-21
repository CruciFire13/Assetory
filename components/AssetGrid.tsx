"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const mockAssets = [
  { id: 1, name: "Hero Image", type: "image", createdAt: "2025-06-20" },
  { id: 2, name: "Logo.svg", type: "vector", createdAt: "2025-06-19" },
];

const mockFolders = [
  { id: "f1", name: "UI Kits" },
  { id: "f2", name: "Icons" },
];

export const AssetGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockFolders.map((folder) => (
        <motion.div
          key={folder.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition">
            <CardContent className="p-4">
              <CardTitle>{folder.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Folder</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {mockAssets.map((asset) => (
        <motion.div
          key={asset.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition">
            <CardContent className="p-4">
              <CardTitle>{asset.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{asset.type}</p>
              <p className="text-xs text-gray-400">
                Uploaded: {asset.createdAt}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

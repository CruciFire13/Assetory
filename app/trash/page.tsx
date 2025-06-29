"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AssetGrid from "@/components/AssetGrid";
import { motion } from "framer-motion";

export default function TrashPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleEmptyTrash = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to empty the trash?"
      );
      if (!confirmed) return;

      const res = await fetch("/api/trash/empty", { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Trash emptied");
      router.refresh();
    } catch {
      toast.error("Failed to empty trash");
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="h-screen bg-gradient-to-br from-[#2a0a0a] via-[#3f0d0d] to-black text-white relative overflow-hidden">
      <div className="z-40 relative">
        <Sidebar />
      </div>

      <div className="fixed top-0 left-0 right-0 z-30">
        <Navbar />
      </div>

      <div className="pt-16 lg:ml-64 h-full flex flex-col relative z-20">
        <main className="p-6 space-y-6 overflow-y-auto flex-1 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center"
          >
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#ff9999] via-[#fca5a5] to-[#ffe6e6] text-transparent bg-clip-text drop-shadow">
              🗑️ Trash
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            <AssetGrid
              endpoint="/api/trash/index"
              allowedActions={["restore", "permanentDelete"]}
              isTrashPage={true}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="fixed bottom-6 right-6 z-30"
          >
            <Button
              variant="destructive"
              size="lg"
              onClick={handleEmptyTrash}
              className="shadow-xl hover:scale-105 transition-transform duration-200"
            >
              Empty Trash
            </Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

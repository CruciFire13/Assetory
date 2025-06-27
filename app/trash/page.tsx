"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AssetGrid from "@/components/AssetGrid";

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
      router.refresh(); // reloads page to refetch trash
    } catch {
      toast.error("Failed to empty trash");
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="p-6 space-y-6 overflow-y-auto">
          <h1 className="text-2xl font-bold">Trash</h1>

          <AssetGrid
            endpoint="/api/trash/index"
            allowedActions={["restore", "permanentDelete"]}
            isTrashPage={true}
          />

          <div className="fixed bottom-6 right-6">
            <Button
              variant="destructive"
              size="lg"
              onClick={handleEmptyTrash}
              className="shadow-lg"
            >
              Empty Trash
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
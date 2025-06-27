"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import SignOutClientButton from "@/components/SignOutClientButton";
import AssetGrid from "@/components/AssetGrid";

export default function SharedPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Items Shared With You</h1>
            <SignOutClientButton />
          </div>

          <AssetGrid
            endpoint="/api/shared/index"
            allowedActions={["open", "download"]}
            isSharedPage={true}
          />
        </main>
      </div>
    </div>
  );
}
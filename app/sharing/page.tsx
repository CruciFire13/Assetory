"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import SignOutClientButton from "@/components/SignOutClientButton";
import AssetGrid from "@/components/AssetGrid";
import { motion } from "framer-motion";

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
    <div className="h-screen bg-gradient-to-br from-[#2a0a0a] via-[#3f0d0d] to-black text-white relative overflow-hidden">
      {/* Sidebar */}
      <div className="z-40 relative">
        <Sidebar />
      </div>

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="pt-16 lg:ml-64 h-full flex flex-col relative z-20">
        <main className="p-6 space-y-6 overflow-y-auto flex-1 z-20">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center"
          >
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#ff9999] via-[#fca5a5] to-[#ffe6e6] text-transparent bg-clip-text drop-shadow">
              🔗 Items Shared With You
            </h1>
            <SignOutClientButton />
          </motion.div>

          {/* Asset Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            <AssetGrid
              endpoint="/api/shared/index"
              allowedActions={["open", "download"]}
              isSharedPage={true}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

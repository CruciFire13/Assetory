"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";

export const Navbar = () => {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<null | {
    name: string;
    email: string;
    image: string;
  }>(null);
  const [open, setOpen] = useState(false);

  const { signOut } = useClerk();

  useEffect(() => {
    setIsClient(true);

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 backdrop-blur-md bg-black/30 border-b border-white/10 shadow-md">
      {/* Left Spacer */}
      <div className="w-10" />

      {/* Centered Logo */}
      {isClient && (
        <motion.h1
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d4d] via-[#ff9999] to-white text-center mx-auto absolute left-1/2 transform -translate-x-1/2"
        >
          Assetory
        </motion.h1>
      )}

      {/* User Avatar */}
      {user && (
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full border border-white/20 p-1 hover:scale-105 transition-transform"
          >
            <Image
              src={user.image}
              alt="User Avatar"
              width={36}
              height={36}
              className="rounded-full"
            />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-64 bg-zinc-900 text-white rounded-lg shadow-xl border border-zinc-700 p-4 z-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={user.image}
                    alt="User Profile"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-zinc-400">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => signOut()}
                  className="w-full mt-2 bg-gradient-to-r from-red-600 to-pink-500 hover:opacity-90 transition text-sm px-4 py-2 rounded-md font-medium"
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </header>
  );
};

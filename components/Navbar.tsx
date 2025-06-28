"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const Navbar = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-center px-6 py-3 backdrop-blur-md bg-black/30 border-b border-white/10 shadow-md">
      {isClient && (
        <motion.h1
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d4d] via-[#ff9999] to-white"
        >
          Assetory
        </motion.h1>
      )}
    </header>
  );
};

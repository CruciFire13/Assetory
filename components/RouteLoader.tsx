"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export const RouteLoader = () => {
  const pathname = usePathname();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setShowLoader(true);

    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          key="route-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            className="relative w-16 h-16"
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.9, 1.05, 0.9] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500 via-pink-500 to-white opacity-20 blur-2xl animate-pulse" />
            <div className="w-full h-full border-[6px] border-red-500 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

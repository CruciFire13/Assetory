"use client";

import LogoReveal from "@/components/LogoReveal";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
      ease: "easeOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-[#2a0a0a] via-[#3f0d0d] to-black text-white font-sans">
      <LogoReveal />

      <motion.div
        className="relative z-10 text-center px-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
        >
          Welcome to{" "}
          <span
            className="inline-block text-transparent bg-gradient-to-r from-[#ff6666] via-[#fca5a5] to-[#ffe6e6]
                       bg-clip-text text-5xl md:text-6xl tracking-wider
                       [text-shadow:_0_0_8px_rgba(255,204,204,0.2)]
                       hover:brightness-110 transition duration-300"
          >
            Assetory
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-4 text-lg md:text-xl max-w-xl mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#fce3e3] via-[#ffeaea] to-[#f3cfcf] 
             drop-shadow-[0_0_6px_rgba(255,235,235,0.2)]"
        >
          Your intelligent hub for managing, sharing, and organizing digital
          assets effortlessly.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col sm:flex-row gap-6 justify-center"
        >
          <Link href="/sign-up">
            <Button
              className="px-10 py-4 text-base uppercase tracking-wide border border-white/30
                         rounded-md shadow-md text-white backdrop-blur-md
                         bg-gradient-to-r from-[#a62121]/40 to-[#d13737]/40
                         hover:from-[#b63232]/60 hover:to-[#e14b4b]/60
                         transition-all duration-300"
            >
              Sign Up
            </Button>
          </Link>

          <Link href="/sign-in">
            <Button
              variant="outline"
              className="px-10 py-4 text-base uppercase tracking-wide border border-white/30
                         rounded-md shadow-md text-white backdrop-blur-md
                         bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              Sign In
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

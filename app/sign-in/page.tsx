"use client";

import LogoReveal from "@/components/LogoReveal";
import SignInForm from "@/components/SignInForm";
import { motion } from "framer-motion";

const containerVariants = {
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function SignInPage() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#2a0a0a] via-[#3f0d0d] to-black text-white font-sans">
      <LogoReveal />

      <motion.div
        className="relative z-10 w-full max-w-md px-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-snug">
            Welcome back to{" "}
            <span className="inline-block text-transparent bg-gradient-to-r from-[#ff6666] via-[#fca5a5] to-[#ffe6e6] bg-clip-text tracking-wider [text-shadow:_0_0_8px_rgba(255,204,204,0.2)]">
              Assetory
            </span>
          </h1>
          <p className="mt-2 text-sm text-[#f3cfcf]">
            Please sign in to access your dashboard and assets.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-md p-2"
        >
          <SignInForm />
        </motion.div>
      </motion.div>
    </main>
  );
}

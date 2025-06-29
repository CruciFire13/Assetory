"use client";

import LogoReveal from "@/components/LogoReveal";
import SignUpForm from "@/components/SignUpForm";
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

export default function SignUpPage() {
  return (
    <main className="relative flex flex-col justify-center items-center min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#2a0a0a] via-[#3f0d0d] to-black text-white font-sans">
      <LogoReveal />

      <motion.div
        className="relative z-10 w-full max-w-lg px-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-snug">
            Create your{" "}
            <span className="inline-block text-transparent bg-gradient-to-r from-[#ff6666] via-[#fca5a5] to-[#ffe6e6] bg-clip-text tracking-wider [text-shadow:_0_0_8px_rgba(255,204,204,0.2)]">
              Assetory
            </span>{" "}
            account
          </h1>
          <p className="mt-2 text-sm text-[#f3cfcf]">
            Start storing and sharing your assets securely and stylishly.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-md p-2 "
        >
          <SignUpForm />
        </motion.div>
      </motion.div>
    </main>
  );
}

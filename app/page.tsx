"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold"
      >
        Welcome to devAsset Hub
      </motion.h1>

      <motion.div
        className="space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Link href="/SignUp">
          <Button variant="default">Sign Up</Button>
        </Link>
        <Link href="/SignIn">
          <Button variant="outline">Sign In</Button>
        </Link>
      </motion.div>
    </main>
  );
}

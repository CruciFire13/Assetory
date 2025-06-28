"use client";

import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function SignOutClientButton() {
  return (
    <SignOutButton>
      <button className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-[#7f1d1d] via-[#b91c1c] to-[#dc2626] hover:from-[#991b1b] hover:to-[#f87171] transition-all shadow-md hover:shadow-lg focus:outline-none">
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </SignOutButton>
  );
}

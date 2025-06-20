"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SignOutClientButton() {
  return (
    <SignOutButton>
      <Button variant="outline" className="flex items-center gap-2">
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </SignOutButton>
  );
}

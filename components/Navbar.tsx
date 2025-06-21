"use client";

import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <h1 className="text-xl font-semibold">My DevAsset Hub</h1>
      <div className="flex items-center space-x-4">
        <UserButton />
      </div>
    </header>
  );
};

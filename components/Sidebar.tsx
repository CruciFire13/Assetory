"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Share2,
  Trash2,
  Menu,
  Grid3X3,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Collections", path: "/collections", icon: FolderKanban },
    ],
  },
  {
    title: "Actions",
    items: [
      { name: "View Assets", path: "/#assets", icon: Grid3X3 },
      { name: "Favourites", path: "/favourites", icon: Star },
    ],
  },
  {
    title: "Other",
    items: [
      { name: "Sharing", path: "/sharing", icon: Share2 },
      { name: "Trash", path: "/trash", icon: Trash2 },
    ],
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative h-full">
      {!isDesktop && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 m-2 rounded-md bg-gray-100 shadow fixed top-4 left-4 z-50"
        >
          <Menu className="h-6 w-6 text-gray-800" />
        </button>
      )}

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen || isDesktop ? 0 : -300 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r shadow-md p-6 space-y-6 flex flex-col",
          "lg:relative lg:translate-x-0"
        )}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">DevAsset Hub</h2>

        {navItems.map((section) => (
          <div key={section.title}>
            <p className="text-xs text-gray-500 uppercase mb-2 px-4">
              {section.title}
            </p>
            <nav className="space-y-1 mb-4">
              {section.items.map(({ name, icon: Icon, path }) => (
                <Link key={name} href={path} onClick={() => setIsOpen(false)}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all",
                      pathname === path && "bg-gray-200 font-semibold"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{name}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </motion.aside>

      {isOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

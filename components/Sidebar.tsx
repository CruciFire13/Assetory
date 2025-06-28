"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Star,
  Share2,
  Trash2,
  Menu,
  ChevronsLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import StorageUsage from "./StorageUsed";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Favourites", path: "/favourites", icon: Star },
  { name: "Sharing", path: "/sharing", icon: Share2 },
  { name: "Trash", path: "/trash", icon: Trash2 },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isDesktop) {
      setIsOpen(!isOpen);
    } else {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  const isSidebarVisible = isDesktop ? isOpen : isMobileOpen;

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:block fixed z-50 top-4 left-4 bg-black/50 text-white p-2 rounded-md backdrop-blur-md shadow-md"
      >
        {isSidebarVisible ? (
          <ChevronsLeft className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      <motion.aside
        initial={{ width: isDesktop ? 240 : 0 }}
        animate={{ width: isSidebarVisible ? (isDesktop ? 240 : 220) : 64 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 z-40 h-screen border-r bg-black/30 text-white backdrop-blur-md shadow-xl overflow-hidden"
      >
        <div className="h-full flex flex-col p-4 space-y-8">
          <motion.h2
            className={cn(
              "text-2xl font-bold text-center tracking-wider transition-all duration-300",
              !isSidebarVisible && "opacity-0 scale-95"
            )}
          >
            <span className="bg-gradient-to-r from-[#ff9999] via-[#ffcccc] to-white bg-clip-text text-transparent drop-shadow">
              {isSidebarVisible ? "Navigation" : "N"}
            </span>
          </motion.h2>

          <nav className="flex flex-col gap-3">
            {navItems.map(({ name, path, icon: Icon }) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={name}
                  href={path}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, x: 4 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-[#ff6666]/70 to-[#ffcccc]/50 shadow-md"
                        : "hover:bg-white/10",
                      !isSidebarVisible && "justify-center px-2"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {isSidebarVisible && (
                      <span className="text-sm">{name}</span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 border-t border-white/10">
            {isSidebarVisible && <StorageUsage />}
          </div>
        </div>
      </motion.aside>

      {isMobileOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

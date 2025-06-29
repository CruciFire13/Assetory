import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import { RouteLoader } from "@/components/RouteLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assetory",
  description:
    "Assetory is a modern, secure, and developer-friendly digital asset hub designed to make file management seamless for developers and teams. Organize, preview, share, and manage your files, code snippets, images, documents, and more — all from your browser, with robust access controls and blazing-fast performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Toaster richColors position="top-right" />
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        >
          <RouteLoader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

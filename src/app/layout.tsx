import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import SidebarNav from "@/components/SidebarNav";
import MobileBottomNav from "@/components/MobileBottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lot168",
  description: "Lot168 - Xổ số, Keno, Wingo",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-200/35 via-transparent to-transparent dark:from-cyan-900/25" />
          <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-r from-fuchsia-300/30 to-emerald-300/30 dark:from-fuchsia-800/20 dark:to-emerald-800/20" />
        </div>
        <AuthProvider>
          <Navbar />
          <div className="mx-auto max-w-6xl px-4 flex gap-6 pb-20 md:pb-6 pt-6">
            <SidebarNav />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => (pathname?.startsWith(href) ? "text-foreground" : "text-foreground/70 hover:text-foreground");

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-foreground">
          Xổ Số Trực Tuyến
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className={isActive("/xskt")} href="/xskt">XSKT</Link>
          <Link className={isActive("/keno")} href="/keno">Keno</Link>
          <Link className={isActive("/dashboard")} href="/dashboard">Tài khoản</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-foreground/80">Xin chào, {user.name}</span>
              <button
                onClick={async () => { await logout(); router.push("/login"); }}
                className="rounded-full border border-black/[.08] dark:border-white/[.145] px-3 py-1.5 text-sm hover:bg-foreground hover:text-background transition-colors"
                disabled={loading}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded-full bg-foreground text-background px-4 py-1.5 text-sm hover:opacity-90 transition-opacity">Đăng nhập</Link>
          )}
        </div>
      </div>
    </header>
  );
}

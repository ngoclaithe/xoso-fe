"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => (pathname?.startsWith(href) ? "text-foreground" : "text-foreground/70 hover:text-foreground");

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-black/5 dark:border-white/10">
      <div className="relative mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight bg-gradient-to-r from-cyan-600 to-fuchsia-600 bg-clip-text text-transparent">
          Lot168
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className={isActive("/xskt") + " transition-colors"} href="/xskt">Xổ số</Link>
          <Link className={isActive("/keno") + " transition-colors"} href="/keno">Keno</Link>
          <Link className={isActive("/wingo") + " transition-colors"} href="/wingo">Wingo</Link>
        </nav>
        <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-cyan-500/40 via-fuchsia-500/40 to-emerald-500/40" />
      </div>
    </header>
  );
}

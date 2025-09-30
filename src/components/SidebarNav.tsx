"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNav() {
  const pathname = usePathname();
  const isActive = (href: string) => (pathname?.startsWith(href) ? "bg-black/[.03] dark:bg-white/[.03] text-foreground" : "text-foreground/80 hover:text-foreground hover:bg-black/[.02] dark:hover:bg-white/[.02]");
  return (
    <aside className="hidden md:block w-48 shrink-0">
      <nav className="sticky top-16 space-y-1">
        <Link href="/xskt" className={`block rounded-xl border border-black/[.08] dark:border-white/[.145] px-3 py-2 text-sm transition-colors ${isActive("/xskt")}`}>Xổ số</Link>
        <Link href="/keno" className={`block rounded-xl border border-black/[.08] dark:border-white/[.145] px-3 py-2 text-sm transition-colors ${isActive("/keno")}`}>Keno</Link>
        <Link href="/wingo" className={`block rounded-xl border border-black/[.08] dark:border-white/[.145] px-3 py-2 text-sm transition-colors ${isActive("/wingo")}`}>Wingo</Link>
      </nav>
    </aside>
  );
}

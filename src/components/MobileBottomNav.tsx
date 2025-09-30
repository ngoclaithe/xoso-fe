"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Tab({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname?.startsWith(href);
  return (
    <Link href={href} className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs ${active ? "text-foreground" : "text-foreground/70"}`}>
      <span className="h-5 w-5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-black/[.08] dark:border-white/[.145] bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 flex">
        <Tab href="/xskt" label="Xổ số" icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 7h18v10H3z"/><path d="M5 5h14v2H5z"/></svg>} />
        <Tab href="/keno" label="Keno" icon={<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>} />
        <Tab href="/wingo" label="Wingo" icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v12H4z"/><path d="M8 10h8v4H8z" className="opacity-70"/></svg>} />
      </div>
    </nav>
  );
}

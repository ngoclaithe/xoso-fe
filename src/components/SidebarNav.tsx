"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-2 rounded-xl border border-black/[.08] dark:border-white/[.145] px-3 py-2 text-sm transition-colors ${active ? "bg-black/[.03] dark:bg-white/[.03] text-foreground" : "text-foreground/80 hover:text-foreground hover:bg-black/[.02] dark:hover:bg-white/[.02]"}`}>
      <img src={icon} alt="" className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

export default function SidebarNav() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:block w-48 shrink-0">
      <nav className="sticky top-16 space-y-1">
        <NavItem href="/xskt" icon="/file.svg" label="Xổ số" active={!!pathname?.startsWith("/xskt")} />
        <NavItem href="/keno" icon="/keno.png" label="Keno" active={!!pathname?.startsWith("/keno")} />
        <NavItem href="/wingo" icon="/window.svg" label="Wingo" active={!!pathname?.startsWith("/wingo")} />
      </nav>
    </aside>
  );
}

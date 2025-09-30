import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-emerald-600 bg-clip-text text-transparent">Lot168</h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link href="/xskt" className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white px-5 py-2 text-sm shadow-sm hover:opacity-90">Xổ số</Link>
            <Link href="/keno" className="rounded-full border border-black/[.08] dark:border-white/[.145] px-5 py-2 text-sm hover:bg-black/[.02] dark:hover:bg-white/[.02]">Keno</Link>
            <Link href="/wingo" className="rounded-full border border-black/[.08] dark:border-white/[.145] px-5 py-2 text-sm hover:bg-black/[.02] dark:hover:bg-white/[.02]">Wingo</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

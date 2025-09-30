import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-6 space-y-6">
        <HeroCarousel />
        <section aria-label="Sản phẩm" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/xskt" className="group rounded-2xl border border-black/[.08] dark:border-white/[.145] p-5 bg-background hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3">
              <img src="/file.svg" alt="Xổ số" className="h-10 w-10" />
              <div>
                <h3 className="font-semibold text-foreground">Xổ số</h3>
                <p className="text-sm text-foreground/70">Chọn số 00–99. Đặt cược an toàn.</p>
              </div>
            </div>
          </Link>
          <Link href="/keno" className="group rounded-2xl border border-black/[.08] dark:border-white/[.145] p-5 bg-background hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3">
              <img src="/globe.svg" alt="Keno" className="h-10 w-10" />
              <div>
                <h3 className="font-semibold text-foreground">Keno</h3>
                <p className="text-sm text-foreground/70">Chọn 1–10 số trong 1..80.</p>
              </div>
            </div>
          </Link>
          <Link href="/wingo" className="group rounded-2xl border border-black/[.08] dark:border-white/[.145] p-5 bg-background hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3">
              <img src="/window.svg" alt="Wingo" className="h-10 w-10" />
              <div>
                <h3 className="font-semibold text-foreground">Wingo</h3>
                <p className="text-sm text-foreground/70">Chọn 1 số 0–9, thưởng nhanh.</p>
              </div>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}

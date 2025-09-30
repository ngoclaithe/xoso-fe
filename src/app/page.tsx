import Link from "next/link";

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl border border-black/[.08] dark:border-white/[.145] p-5 overflow-hidden transition-transform hover:-translate-y-0.5"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/10 to-emerald-500/10" />
      <h3 className="relative font-semibold text-lg text-foreground mb-1">{title}</h3>
      <p className="relative text-sm text-foreground/70">{desc}</p>
      <span className="relative mt-3 inline-block text-sm bg-gradient-to-r from-cyan-600 to-fuchsia-600 bg-clip-text text-transparent">Bắt đầu →</span>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-emerald-600 bg-clip-text text-transparent">Nền tảng xổ số và keno trực tuyến</h1>
          <p className="mt-2 text-foreground/70">Đăng nhập, chọn số yêu thích và đặt cược an toàn qua BFF proxy.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/xskt" className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white px-5 py-2 text-sm shadow-sm hover:opacity-90">Chơi XSKT</Link>
            <Link href="/keno" className="rounded-full border border-black/[.08] dark:border-white/[.145] px-5 py-2 text-sm hover:bg-black/[.02] dark:hover:bg-white/[.02]">Thử Keno</Link>
          </div>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Card title="Xổ số kiến thiết" desc="Chọn bộ số và đặt vé nhanh chóng." href="/xskt" />
          <Card title="Keno" desc="Chọn 1-10 số trong 1..80, linh hoạt mức cược." href="/keno" />
          <Card title="Tài khoản" desc="Xem lịch sử đặt cược, quản lý thông tin." href="/dashboard" />
        </section>
      </main>
    </div>
  );
}

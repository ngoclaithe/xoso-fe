import Link from "next/link";

function Card({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-black/[.08] dark:border-white/[.145] p-5 hover:bg-black/[.02] dark:hover:bg-white/[.02] transition-colors"
    >
      <h3 className="font-semibold text-lg text-foreground mb-1">{title}</h3>
      <p className="text-sm text-foreground/70">{desc}</p>
      <span className="mt-3 inline-block text-sm text-foreground/80 group-hover:underline">Bắt đầu →</span>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Nền tảng xổ số và keno trực tuyến</h1>
          <p className="mt-2 text-foreground/70">Đăng nhập, chọn số yêu thích và đặt cược an toàn qua BFF proxy.</p>
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

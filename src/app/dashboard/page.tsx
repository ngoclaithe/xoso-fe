"use client";

import { recentBets } from "@/lib/bffClient";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [items, setItems] = useState<Awaited<ReturnType<typeof recentBets>>["items"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { items } = await recentBets();
        setItems(items);
      } catch (e: any) {
        setError(e?.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold bg-gradient-to-r from-cyan-600 to-fuchsia-600 bg-clip-text text-transparent mb-6">Tài khoản</h1>
      <section className="rounded-2xl border border-black/[.08] dark:border-white/[.145] p-5 bg-background">
        <h2 className="font-medium text-foreground mb-3">Lịch sử đặt cược</h2>
        {loading && <div className="text-sm text-foreground/70">Đang tải...</div>}
        {error && <div className="text-sm text-red-600" role="alert">{error}</div>}
        {!loading && !error && (
          <ul className="space-y-3">
            {items.length === 0 && <li className="text-sm text-foreground/70">Chưa có giao dịch</li>}
            {items.map((b) => (
              <li key={b.id} className="p-[1px] rounded-xl bg-gradient-to-r from-cyan-500/40 via-fuchsia-500/40 to-emerald-500/40">
                <div className="rounded-[10px] border border-black/[.06] dark:border-white/[.09] p-3 flex items-center justify-between bg-background">
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{b.product.toUpperCase()}</div>
                    <div className="text-foreground/70">Số: {b.selections.join(", ")}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-foreground/80">{new Date(b.createdAt).toLocaleString()}</div>
                    <div className="text-foreground font-medium">{b.stake.toLocaleString()} đ</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

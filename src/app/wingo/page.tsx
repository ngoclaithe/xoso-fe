"use client";

import { useState } from "react";
import { placeBet } from "@/lib/bffClient";
import { useRouter } from "next/navigation";

export default function WingoPage() {
  const [selection, setSelection] = useState<number | null>(null);
  const [stake, setStake] = useState<number>(10000);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async () => {
    setError(null);
    try {
      if (selection === null) throw new Error("Vui lòng chọn 1 số (0-9)");
      if (stake <= 0) throw new Error("Mức cược không hợp lệ");
      await placeBet({ product: "bet", selections: [selection], stake });
      setSelection(null);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e?.message || "Lỗi đặt cược");
    }
  };

  return (
    <main className="py-0 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-cyan-600 to-fuchsia-600 bg-clip-text text-transparent">Wingo</h1>
        <p className="text-sm text-foreground/70">Chọn 1 số từ 0 đến 9</p>
      </header>
      <section className="rounded-2xl border border-black/[.08] dark:border-white/[.145] p-5 space-y-4 bg-background">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => i).map((n) => (
            <button
              key={n}
              onClick={() => setSelection(n)}
              className={`rounded-lg border px-2 py-2 text-sm transition-colors ${
                selection === n
                  ? "bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white border-transparent"
                  : "bg-background text-foreground border-black/[.08] dark:border-white/[.145] hover:bg-black/[.02] dark:hover:bg-white/[.02]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-foreground/80">Mức cược (đ)</label>
          <input
            type="number"
            min={1000}
            step={1000}
            className="w-40 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/50"
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
          />
          <button onClick={submit} className="ml-auto rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white px-4 py-2 hover:opacity-90">Đặt cược</button>
        </div>
        {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";
import { placeBet } from "@/lib/bffClient";
import { useRouter } from "next/navigation";

function NumberGrid({ max, selections, setSelections, maxPick }: { max: number; selections: number[]; setSelections: (n: number[]) => void; maxPick: number }) {
  const toggle = (n: number) => {
    let next = selections.includes(n) ? selections.filter((x) => x !== n) : [...selections, n];
    if (next.length > maxPick) next = next.slice(1);
    setSelections(next.sort((a, b) => a - b));
  };
  return (
    <div className="grid grid-cols-10 gap-2">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => toggle(n)}
          className={`rounded-lg border px-2 py-1 text-sm ${
            selections.includes(n)
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-foreground border-black/[.08] dark:border-white/[.145] hover:bg-black/[.02] dark:hover:bg-white/[.02]"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function KenoPage() {
  const [selections, setSelections] = useState<number[]>([]);
  const [maxPick, setMaxPick] = useState<number>(10);
  const [stake, setStake] = useState<number>(10000);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async () => {
    setError(null);
    try {
      if (selections.length === 0 || selections.length > maxPick) throw new Error("Chọn 1-" + maxPick + " số");
      if (stake <= 0) throw new Error("Mức cược không hợp lệ");
      await placeBet({ product: "keno", selections, stake });
      setSelections([]);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e?.message || "Lỗi đặt cược");
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Keno</h1>
        <p className="text-sm text-foreground/70">Chọn 1-10 số trong 1..80</p>
      </header>

      <section className="rounded-2xl border border-black/[.08] dark:border-white/[.145] p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm text-foreground/80">Số lượng số chọn</label>
          <select
            className="rounded-xl border border-black/[.08] dark:border-white/[.145] bg-background px-3 py-2"
            value={maxPick}
            onChange={(e) => setMaxPick(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <div className="flex items-center gap-3">
            <label className="text-sm text-foreground/80">Mức cược (đ)</label>
            <input
              type="number"
              min={1000}
              step={1000}
              className="w-40 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
            />
          </div>
        </div>
        <NumberGrid max={80} selections={selections} setSelections={setSelections} maxPick={maxPick} />
        {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
        <button onClick={submit} className="rounded-xl bg-foreground text-background px-4 py-2 hover:opacity-90">Đặt cược</button>
      </section>
    </main>
  );
}

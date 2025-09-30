"use client";

import { useMemo, useState } from "react";
import { placeBet } from "@/lib/bffClient";
import { useRouter } from "next/navigation";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function HundredGrid({ selections, setSelections, limit }: { selections: number[]; setSelections: (n: number[]) => void; limit: number }) {
  const toggle = (n: number) => {
    let next = selections.includes(n) ? selections.filter((x) => x !== n) : [...selections, n];
    if (next.length > limit) next = next.slice(1);
    setSelections(next.sort((a, b) => a - b));
  };
  return (
    <div className="grid grid-cols-10 gap-2">
      {Array.from({ length: 100 }, (_, i) => i).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => toggle(n)}
          className={`rounded-lg border px-2 py-1 text-sm transition-colors ${
            selections.includes(n)
              ? "bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white border-transparent"
              : "bg-background text-foreground border-black/[.08] dark:border-white/[.145] hover:bg-black/[.02] dark:hover:bg-white/[.02]"
          }`}
        >
          {pad2(n)}
        </button>
      ))}
    </div>
  );
}

function useDailyResults() {
  return useMemo(() => {
    const d = new Date();
    const seed = Number(`${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, "0")}${d.getDate().toString().padStart(2, "0")}`);
    let x = seed % 100000;
    const next = () => (x = (x * 48271) % 0x7fffffff);
    const num = (digits: number) => (next(), (x % Math.pow(10, digits)).toString().padStart(digits, "0"));
    return {
      date: d.toLocaleDateString("vi-VN"),
      dacBiet: num(5),
      giaiNhat: num(5),
      loTo2So: Array.from({ length: 10 }, () => num(2)),
    };
  }, []);
}

export default function XSKTPage() {
  const [selections, setSelections] = useState<number[]>([]);
  const [stake, setStake] = useState<number>(10000);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const router = useRouter();
  const results = useDailyResults();

  const submit = async () => {
    setError(null); setOk(null);
    try {
      if (selections.length === 0) throw new Error("Vui lòng chọn ít nhất 1 số");
      if (stake <= 0) throw new Error("Mức cược không hợp lệ");
      await placeBet({ product: "xskt", selections, stake });
      setOk("Đặt vé thành công");
      setSelections([]);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e?.message || "Lỗi đặt vé");
    }
  };

  return (
    <main className="py-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-black/[.08] dark:border-white/[.145] p-5 space-y-4 bg-background">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-cyan-600 to-fuchsia-600 bg-clip-text text-transparent">Xổ số</h1>
            <p className="text-sm text-foreground/70">Chọn các số từ 00 đến 99</p>
          </header>
          <HundredGrid selections={selections} setSelections={setSelections} limit={20} />
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-foreground/80">Mức cược (đ)</label>
            <input
              type="number"
              min={1000}
              step={1000}
              className="w-40 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/50"
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
            />
            <button onClick={submit} className="ml-auto rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white px-4 py-2 hover:opacity-90">Đặt vé</button>
          </div>
          {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
          {ok && <div className="text-green-600 text-sm" role="status">{ok}</div>}
        </section>

        <aside className="rounded-2xl border border-black/[.08] dark:border-white/[.145] p-5 bg-background">
          <h2 className="text-lg font-semibold text-foreground mb-2">Kết quả xổ số</h2>
          <div className="text-sm text-foreground/70 mb-3">Ngày {results.date}</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-black/[.08] dark:border-white/[.145] p-3">
              <span className="text-foreground/80">Đặc biệt</span>
              <span className="font-semibold tracking-wider">{results.dacBiet}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-black/[.08] dark:border-white/[.145] p-3">
              <span className="text-foreground/80">Giải nhất</span>
              <span className="font-semibold tracking-wider">{results.giaiNhat}</span>
            </div>
            <div>
              <div className="text-foreground/80 mb-1">Lô tô 2 số</div>
              <div className="grid grid-cols-5 gap-2">
                {results.loTo2So.map((v, i) => (
                  <div key={`${v}-${i}`} className="rounded-lg border border-black/[.08] dark:border-white/[.145] p-2 text-center text-sm">
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

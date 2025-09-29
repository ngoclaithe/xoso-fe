"use client";

import { useState } from "react";
import { placeBet } from "@/lib/bffClient";
import { useRouter } from "next/navigation";

function NumberGrid({ max, selections, setSelections }: { max: number; selections: number[]; setSelections: (n: number[]) => void }) {
  const toggle = (n: number) => {
    const next = selections.includes(n) ? selections.filter((x) => x !== n) : [...selections, n];
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

export default function XSKTPage() {
  const [selections, setSelections] = useState<number[]>([]);
  const [stake, setStake] = useState<number>(10000);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const router = useRouter();

  const submit = async () => {
    setError(null); setOk(null);
    try {
      if (selections.length !== 6) throw new Error("Vui lòng chọn đúng 6 số");
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
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Xổ số kiến thiết</h1>
        <p className="text-sm text-foreground/70">Chọn 6 số trong khoảng 1..60</p>
      </header>

      <section className="rounded-2xl border border-black/[.08] dark:border-white/[.145] p-5 space-y-4">
        <NumberGrid max={60} selections={selections} setSelections={setSelections} />
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
        {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
        {ok && <div className="text-green-600 text-sm" role="status">{ok}</div>}
        <button onClick={submit} className="rounded-xl bg-foreground text-background px-4 py-2 hover:opacity-90">Đặt vé</button>
      </section>
    </main>
  );
}

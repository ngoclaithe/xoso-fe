"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { placeBet } from "@/lib/bffClient";
import { useRouter } from "next/navigation";

type TabKey = "30s" | "1m" | "3m" | "5m";

const TAB_CONFIG: Record<TabKey, { label: string; seconds: number }> = {
  "30s": { label: "Win Go 30s", seconds: 30 },
  "1m": { label: "Win Go 1Min", seconds: 60 },
  "3m": { label: "Win Go 3Min", seconds: 180 },
  "5m": { label: "Win Go 5Min", seconds: 300 },
};

const MULTIPLIERS = [1, 5, 10, 20, 50, 100];

function formatMMSS(totalSeconds: number) {
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function getPeriodIndex(nowMs: number, seconds: number) {
  return Math.floor(nowMs / (seconds * 1000));
}

function resultForPeriod(periodIndex: number) {
  // Deterministic pseudo-random; stable across clients
  return (periodIndex * 1103515245 + 12345 >>> 0) % 10;
}

export default function WingoPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("30s");
  const [selection, setSelection] = useState<number | null>(null);
  const [colorPick, setColorPick] = useState<"green" | "purple" | "red" | null>(null);
  const [sizePick, setSizePick] = useState<"big" | "small" | null>(null);
  const [stake, setStake] = useState<number>(10000);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const [timeLeftLabel, setTimeLeftLabel] = useState<string>("00:30");
  const [overlaySeconds, setOverlaySeconds] = useState<number | null>(null); // 5..1
  const [showResult, setShowResult] = useState<{ visible: boolean; value: number | null }>({ visible: false, value: null });
  const prevBucketRef = useRef<number>(-1);

  const seconds = TAB_CONFIG[tab].seconds;

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const msIntoPeriod = now % (seconds * 1000);
      const msLeft = seconds * 1000 - msIntoPeriod;
      const sLeft = Math.floor(msLeft / 1000); // 0..seconds-1
      setTimeLeftLabel(formatMMSS(sLeft));

      // Countdown overlay for last 5 seconds: 05..01
      const overlay = Math.ceil(msLeft / 1000); // 1..seconds
      if (overlay <= 5 && overlay >= 1) {
        setOverlaySeconds(overlay);
      } else {
        setOverlaySeconds(null);
      }

      // Detect boundary to show result for the finishing period
      const bucket = Math.floor(msLeft / 1000); // integer seconds bucket
      if (prevBucketRef.current !== bucket) {
        if (bucket === 0) {
          const periodIdx = getPeriodIndex(now - 1, seconds); // finishing period
          const v = resultForPeriod(periodIdx);
          setShowResult({ visible: true, value: v });
          // Hide after 1.5s or when new period clearly starts
          setTimeout(() => setShowResult((prev) => (prev.value === v ? { visible: false, value: prev.value } : prev)), 1500);
        }
        prevBucketRef.current = bucket;
      }
    };
    update();
    const id = setInterval(update, 200);
    return () => clearInterval(id);
  }, [seconds]);

  const computedStake = useMemo(() => Math.max(0, stake * multiplier), [stake, multiplier]);

  const randomPick = () => {
    const n = Math.floor(Math.random() * 10);
    setSelection(n);
  };

  const submit = async () => {
    setError(null);
    try {
      if (selection === null) throw new Error("Vui lòng chọn 1 số (0-9)");
      if (computedStake <= 0) throw new Error("Mức cược không hợp lệ");
      await placeBet({ product: "bet", selections: [selection], stake: computedStake });
      setSelection(null);
      setColorPick(null);
      setSizePick(null);
      setMultiplier(1);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e?.message || "Lỗi đặt cược");
    }
  };

  return (
    <main className="py-0 space-y-5">
      {/* Tabs */}
      <div className="flex gap-2">
        {(Object.keys(TAB_CONFIG) as TabKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm border transition-colors ${
              tab === k
                ? "bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white border-transparent"
                : "bg-background text-foreground border-black/[.08] dark:border-white/[.145] hover:bg-black/[.02] dark:hover:bg-white/[.02]"
            }`}
          >
            <span className="inline-block h-4 w-4 rounded-full border border-white/50 bg-black/[.10]" />
            {TAB_CONFIG[k].label}
          </button>
        ))}
      </div>

      {/* Info panel */}
      <section className="rounded-2xl border border-black/[.08] dark:border-white/[.145] p-4 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground/70">{TAB_CONFIG[tab].label}</p>
                <div className="mt-2 flex items-center gap-1">
                  {[4, 3, 6, 2, 3].map((n) => (
                    <span key={n} className="h-6 w-6 grid place-items-center rounded-full bg-emerald-500/90 text-white text-xs font-semibold">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <button className="rounded-xl border border-black/[.08] dark:border-white/[.145] px-3 py-1.5 text-sm">Cách chơi</button>
            </div>
          </div>
          <div className="p-3 border-t md:border-t-0 md:border-l border-dashed border-black/[.08] dark:border-white/[.145]">
            <p className="text-xs text-foreground/70">Thời gian còn lại</p>
            <div className="mt-2 flex items-end gap-3">
              <div className="flex items-center gap-1">
                {timeLeftLabel.split("").map((ch, idx) => (
                  <span key={idx} className={`h-9 min-w-7 grid place-items-center rounded-md bg-black/[.04] dark:bg-white/[.06] text-sm font-semibold ${ch === ":" ? "px-1" : "px-2"}`}>
                    {ch}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-foreground/60">{new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Color quick picks */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { k: "green", label: "Xanh", cls: "bg-emerald-500" },
          { k: "purple", label: "Tím", cls: "bg-fuchsia-500" },
          { k: "red", label: "Đỏ", cls: "bg-rose-500" },
        ].map((c) => (
          <button
            key={c.k}
            onClick={() => setColorPick(c.k as typeof colorPick)}
            className={`rounded-xl px-3 py-2 text-white text-sm font-medium ${c.cls} ${
              colorPick === (c.k as typeof colorPick) ? "ring-2 ring-offset-2 ring-black/10 dark:ring-white/20" : ""
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Number balls - one horizontal row using the same image for all buttons */}
      <section className="rounded-2xl border border-black/[.08] dark:border-white/[.145] p-4 bg-background">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {Array.from({ length: 10 }, (_, i) => i).map((n) => (
            <button
              key={n}
              onClick={() => setSelection(n)}
              className={`relative overflow-hidden rounded-full p-0 aspect-square w-14 grid place-items-center border flex-shrink-0 transition ${
                selection === n
                  ? "ring-2 ring-cyan-400/70 border-transparent"
                  : "border-black/[.08] dark:border-white/[.145]"
              }`}
            >
              <img src="/wingo-removebg-preview.png" alt="Bóng số" className="absolute inset-0 h-full w-full object-cover" />
              <span className="relative z-[1] text-lg font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">{n}</span>
            </button>
          ))}
        </div>

        {/* Controls row */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button onClick={randomPick} className="rounded-xl border border-black/[.08] dark:border-white/[.145] px-3 py-2 text-sm">Ngẫu nhiên</button>

          <div className="flex items-center gap-2">
            {MULTIPLIERS.map((m) => (
              <button
                key={m}
                onClick={() => setMultiplier(m)}
                className={`rounded-lg px-3 py-1.5 text-xs border transition ${
                  multiplier === m
                    ? "bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white border-transparent"
                    : "bg-background text-foreground border-black/[.08] dark:border-white/[.145]"
                }`}
              >
                X{m}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <label className="text-sm text-foreground/80">Mức cược (đ)</label>
            <input
              type="number"
              min={1000}
              step={1000}
              className="w-36 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/50"
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={() => setSizePick("big")}
            className={`rounded-xl px-3 py-2 text-sm font-medium border ${
              sizePick === "big"
                ? "bg-amber-500 text-white border-transparent"
                : "bg-amber-400/20 text-amber-700 dark:text-amber-300 border-amber-300/40"
            }`}
          >
            Lớn
          </button>
          <button
            onClick={() => setSizePick("small")}
            className={`rounded-xl px-3 py-2 text-sm font-medium border ${
              sizePick === "small"
                ? "bg-sky-500 text-white border-transparent"
                : "bg-sky-400/20 text-sky-700 dark:text-sky-300 border-sky-300/40"
            }`}
          >
            Nhỏ
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button className="rounded-xl border border-black/[.08] dark:border-white/[.145] px-3 py-2 text-sm">Lịch sử trò chơi</button>
          <button className="rounded-xl border border-black/[.08] dark:border-white/[.145] px-3 py-2 text-sm">Biểu đồ</button>
          <button className="rounded-xl border border-black/[.08] dark:border-white/[.145] px-3 py-2 text-sm">Lịch sử của tôi</button>
          <button onClick={submit} className="ml-auto rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white px-4 py-2 hover:opacity-90">Đặt cược</button>
        </div>

        {error && <div className="mt-3 text-red-600 text-sm" role="alert">{error}</div>}
        <div className="mt-1 text-xs text-foreground/60">Tổng cược: {computedStake.toLocaleString("vi-VN")} đ</div>
      </section>

      {/* Overlays: countdown 05..01 then result */}
      {(overlaySeconds !== null || showResult.visible) && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          {overlaySeconds !== null ? (
            <div className="rounded-3xl px-10 py-8 bg-background border border-black/[.08] dark:border-white/[.145] text-center">
              <div className="text-7xl font-bold bg-gradient-to-r from-cyan-500 to-fuchsia-600 bg-clip-text text-transparent">
                {String(overlaySeconds).padStart(2, "0")}
              </div>
              <div className="mt-2 text-sm text-foreground/70">Chuẩn bị hiển thị kết quả</div>
            </div>
          ) : (
            <div className="rounded-3xl px-10 py-8 bg-background border border-black/[.08] dark:border-white/[.145] text-center">
              <div className="text-sm text-foreground/70">Kết quả</div>
              <div className="mt-1 text-7xl font-bold bg-gradient-to-r from-cyan-500 to-fuchsia-600 bg-clip-text text-transparent">
                {showResult.value}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

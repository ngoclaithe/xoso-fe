"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Email không hợp lệ");
      if (password.length < 3) throw new Error("Mật khẩu tối thiểu 3 ký tự");
      await login(email, password);
      router.push(next);
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold bg-gradient-to-r from-cyan-600 to-fuchsia-600 bg-clip-text text-transparent mb-6">Đăng nhập</h1>
      <div className="p-[1px] rounded-2xl bg-gradient-to-br from-cyan-500/50 via-fuchsia-500/50 to-emerald-500/50">
        <form onSubmit={onSubmit} className="rounded-2xl border border-black/[.06] dark:border-white/[.09] p-5 space-y-4 bg-background">
          {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-foreground/80">Email</label>
            <input
              id="email"
              type="email"
              className="w-full rounded-xl border border-black/[.08] dark:border-white/[.145] bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-foreground/80">Mật khẩu</label>
            <input
              id="password"
              type="password"
              className="w-full rounded-xl border border-black/[.08] dark:border-white/[.145] bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-fuchsia-400/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white py-2 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </main>
  );
}

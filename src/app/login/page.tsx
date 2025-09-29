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
      <h1 className="text-2xl font-semibold text-foreground mb-6">Đăng nhập</h1>
      <form onSubmit={onSubmit} className="rounded-2xl border border-black/[.08] dark:border-white/[.145] p-5 space-y-4">
        {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm text-foreground/80">Email</label>
          <input
            id="email"
            type="email"
            className="w-full rounded-xl border border-black/[.08] dark:border-white/[.145] bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
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
            className="w-full rounded-xl border border-black/[.08] dark:border-white/[.145] bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-foreground text-background py-2 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
    </main>
  );
}

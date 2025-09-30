export type BetProduct = "xskt" | "keno" | "bet";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/bff/${path}`, {
    ...(init || {}),
    headers: {
      "content-type": "application/json",
      ...(init && init.headers ? (init.headers as Record<string, string>) : {}),
    },
    credentials: "include",
  });
  if (!res.ok) {
    let msg = "Request failed";
    try {
      const data = await res.json();
      msg = data.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function login(email: string, password: string) {
  return api<{ user: { id: string; email: string; name: string } }>("auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return api<{ ok: boolean }>("auth/logout", { method: "POST" });
}

export async function me() {
  return api<{ user: { id: string; email: string; name: string } }>("auth/me", { method: "GET" });
}

export async function placeBet(payload: { product: BetProduct; selections: number[]; stake: number }) {
  return api<{ bet: { id: string } }>("bets/place", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function recentBets() {
  return api<{ items: Array<{ id: string; product: BetProduct; selections: number[]; stake: number; createdAt: string }> }>(
    "bets/recent",
    { method: "GET" }
  );
}

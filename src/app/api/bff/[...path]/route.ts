import { cookies } from "next/headers";

const BACKEND = process.env.BACKEND_API_BASE;
const isMock = !BACKEND;

type User = { id: string; email: string; name: string };

type Bet = {
  id: string;
  userId: string;
  product: "xskt" | "keno" | "bet";
  selections: number[];
  stake: number;
  createdAt: string;
};

// Simple in-memory mock store (persists for the lifetime of the server process)
const mockStore: { tokens: Map<string, User>; bets: Bet[] } = globalThis.__MOCK_STORE__ || {
  tokens: new Map<string, User>(),
  bets: [],
};
// @ts-expect-error attach to global for hot reload persistence
globalThis.__MOCK_STORE__ = mockStore;

function json(res: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

function unauthorized() {
  return json({ error: "Unauthorized" }, { status: 401 });
}

async function proxyRequest(path: string, req: Request) {
  if (!BACKEND) return json({ error: "BACKEND_API_BASE is not configured" }, { status: 500 });

  const url = `${BACKEND.replace(/\/$/, "")}/${path}`;
  const headers = new Headers(req.headers);

  // Inject Authorization from cookie if present
  const token = cookies().get("auth_token")?.value;
  if (token && !headers.get("authorization")) headers.set("authorization", `Bearer ${token}`);

  // Do not forward host header
  headers.delete("host");

  const init: RequestInit = {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
  };

  const res = await fetch(url, init);
  const resHeaders = new Headers(res.headers);
  // Clean hop-by-hop headers
  resHeaders.delete("transfer-encoding");

  return new Response(res.body, { status: res.status, headers: resHeaders });
}

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const path = (params.path || []).join("/");

  if (!isMock) {
    return proxyRequest(path, req);
  }

  // Mock endpoints
  if (path === "auth/me") {
    const token = cookies().get("auth_token")?.value;
    if (!token) return unauthorized();
    const user = mockStore.tokens.get(token);
    if (!user) return unauthorized();
    return json({ user });
  }

  if (path === "bets/recent") {
    const token = cookies().get("auth_token")?.value;
    if (!token) return unauthorized();
    const user = mockStore.tokens.get(token);
    if (!user) return unauthorized();
    const recent = mockStore.bets
      .filter((b) => b.userId === user.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 20);
    return json({ items: recent });
  }

  return json({ error: "Not found" }, { status: 404 });
}

export async function POST(req: Request, { params }: { params: { path: string[] } }) {
  const path = (params.path || []).join("/");

  if (!isMock) {
    return proxyRequest(path, req);
  }

  if (path === "auth/login") {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body as { email?: string; password?: string };
    if (!email || typeof email !== "string" || !password || password.length < 3) {
      return json({ error: "Email hoặc mật khẩu không hợp lệ" }, { status: 400 });
    }
    const user: User = { id: email, email, name: email.split("@")[0] };
    const token = `mock-${Math.random().toString(36).slice(2)}`;
    mockStore.tokens.set(token, user);

    // Set secure, httpOnly cookie
    const c = cookies();
    c.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return json({ user });
  }

  if (path === "auth/logout") {
    const c = cookies();
    c.set("auth_token", "", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 0 });
    return json({ ok: true });
  }

  if (path === "bets/place") {
    const token = cookies().get("auth_token")?.value;
    if (!token) return unauthorized();
    const user = mockStore.tokens.get(token);
    if (!user) return unauthorized();

    const body = await req.json().catch(() => ({}));
    const { product, selections, stake } = body as {
      product?: Bet["product"];
      selections?: number[];
      stake?: number;
    };
    if (!product || !Array.isArray(selections) || selections.length === 0 || !stake || stake <= 0) {
      return json({ error: "Dữ liệu đặt cược không hợp lệ" }, { status: 400 });
    }
    const id = `bet_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const bet: Bet = {
      id,
      userId: user.id,
      product,
      selections: selections.map((n) => Number(n)).filter((n) => Number.isInteger(n)),
      stake: Number(stake),
      createdAt: new Date().toISOString(),
    };
    mockStore.bets.unshift(bet);
    return json({ bet });
  }

  return json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(req: Request, ctx: { params: { path: string[] } }) {
  // Proxy other verbs in mock too
  if (!isMock) return proxyRequest((ctx.params.path || []).join("/"), req);
  return json({ ok: true });
}

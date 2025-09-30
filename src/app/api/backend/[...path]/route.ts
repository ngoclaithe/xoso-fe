import { cookies } from "next/headers";

const URL_BACKEND = process.env.URL_BACKEND;

function ensureConfigured() {
  if (!URL_BACKEND) {
    return new Response(JSON.stringify({ error: "URL_BACKEND is not configured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
  return null;
}

async function forward(path: string[], req: Request) {
  const notConfigured = ensureConfigured();
  if (notConfigured) return notConfigured;

  const base = (URL_BACKEND as string).replace(/\/$/, "");
  const inUrl = new URL(req.url);
  const targetPath = path.join("/");
  const url = `${base}/api/v1/${targetPath}${inUrl.search}`;

  const headers = new Headers(req.headers);
  const token = cookies().get("auth_token")?.value;
  if (token && !headers.get("authorization")) headers.set("authorization", `Bearer ${token}`);
  headers.delete("host");

  const init: RequestInit = {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
    redirect: "manual",
  };

  const res = await fetch(url, init);
  const resHeaders = new Headers(res.headers);
  resHeaders.delete("transfer-encoding");
  return new Response(res.body, { status: res.status, headers: resHeaders });
}

export async function GET(req: Request, ctx: { params: { path: string[] } }) {
  return forward(ctx.params.path || [], req);
}
export async function HEAD(req: Request, ctx: { params: { path: string[] } }) {
  return forward(ctx.params.path || [], req);
}
export async function POST(req: Request, ctx: { params: { path: string[] } }) {
  return forward(ctx.params.path || [], req);
}
export async function PUT(req: Request, ctx: { params: { path: string[] } }) {
  return forward(ctx.params.path || [], req);
}
export async function PATCH(req: Request, ctx: { params: { path: string[] } }) {
  return forward(ctx.params.path || [], req);
}
export async function DELETE(req: Request, ctx: { params: { path: string[] } }) {
  return forward(ctx.params.path || [], req);
}

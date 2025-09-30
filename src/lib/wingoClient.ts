type RoomType = string; // e.g. "1m" | "3m" | "5m"

export type WingoCurrent = {
  id: string;
  roomType: RoomType;
  roundNumber: number;
  status: string;
  bettingStartTime: string;
  bettingEndTime: string;
  drawTime: string;
  totalBetAmount: string;
  timeRemaining: number;
};

export type WingoHistoryItem = {
  id: string;
  roundNumber: number;
  resultNumber: number;
  resultColor: string;
  resultParity: string;
  totalBetAmount: string;
  totalWinAmount: string;
  drawTime: string;
};

export type WingoHistoryResponse = {
  data: WingoHistoryItem[];
  total: number;
  page: number;
  totalPages?: number;
};

export type BetType = "color" | "number" | "parity";
export type PlaceBetPayload = { betType: BetType; betValue: string; betAmount: number };
export type PlaceBetResponse = {
  id: string;
  roundNumber: number;
  betType: BetType;
  betValue: string;
  betAmount: string;
  odds: string;
  expectedWin: string;
};

export type MyBetItem = {
  id: string;
  roundNumber: number;
  roomType: RoomType;
  betType: BetType;
  betValue: string;
  betAmount: string;
  odds: string;
  status: "won" | "lost" | "pending";
  winAmount?: string;
  resultNumber?: number;
  resultColor?: string;
  createdAt: string;
};

export type MyBetsResponse = { data: MyBetItem[]; total: number; page: number; totalPages?: number };

export type WingoStatistics = {
  totalRounds: number;
  colors: { green: { count: number; percentage: string }; red: { count: number; percentage: string }; violet: { count: number; percentage: string } };
  parity: { even: { count: number; percentage: string }; odd: { count: number; percentage: string } };
  numbers: Array<{ number: number; frequency: number; percentage: string }>;
};

export type WingoHotCold = {
  hotNumbers: Array<{ number: number; frequency: number }>;
  coldNumbers: Array<{ number: number; frequency: number }>;
  avgFrequency: string;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/backend/${path}`, {
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
      msg = (data && (data.error || data.message)) || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export function getCurrent(roomType: RoomType) {
  return api<WingoCurrent>(`wingo/${encodeURIComponent(roomType)}/current`);
}

export function getHistory(roomType: RoomType, params: { page?: number; limit?: number } = {}) {
  const q = new URLSearchParams();
  if (params.page != null) q.set("page", String(params.page));
  if (params.limit != null) q.set("limit", String(params.limit));
  const qs = q.toString();
  return api<WingoHistoryResponse>(`wingo/${encodeURIComponent(roomType)}/history${qs ? `?${qs}` : ""}`);
}

export function placeBet(roomType: RoomType, roundId: string, payload: PlaceBetPayload) {
  return api<PlaceBetResponse>(`wingo/${encodeURIComponent(roomType)}/${encodeURIComponent(roundId)}/bet`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMyBets(params: { page?: number; limit?: number } = {}) {
  const q = new URLSearchParams();
  if (params.page != null) q.set("page", String(params.page));
  if (params.limit != null) q.set("limit", String(params.limit));
  const qs = q.toString();
  return api<MyBetsResponse>(`wingo/my-bets${qs ? `?${qs}` : ""}`);
}

export function getStatistics(roomType: RoomType) {
  return api<WingoStatistics>(`wingo/${encodeURIComponent(roomType)}/statistics`);
}

export function getHotCold(roomType: RoomType) {
  return api<WingoHotCold>(`wingo/${encodeURIComponent(roomType)}/hot-cold`);
}

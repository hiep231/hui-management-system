const BASE_URL = "/api";

interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  moreInfo?: any;
}

const fetchApi = async <T>(
  endpoint: string,
  method: "GET" | "POST" = "GET",
  body: any = null
): Promise<ApiResponse<T>> => {
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Lỗi API");
    }
    return data;
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }
};

export const api = {
  // 1. User
  login: (phone, password) =>
    fetchApi<any>("/user/login", "POST", { phone, password }),
  profile: () => fetchApi<any>("/user/profile", "GET"),

  // 2. Player
  getAllPlayers: () => fetchApi<any[]>("/players", "GET"),
  createPlayer: (userName) => fetchApi<any>("/players", "POST", { userName }),

  updatePlayer: (id: string, data: { userName?: string }) =>
    fetchApi<any>(`/players/${id}`, "POST", data),
  deletePlayer: (id: string) => fetchApi<any>(`/players/delete/${id}`, "POST"),

  // 3. Fund (Group)
  getGroupedFunds: () => fetchApi<any[]>("/funds/grouped", "GET"),
  getFundById: (fundId: string) => fetchApi<any>(`/funds/${fundId}`, "GET"),
  updateFund: (data: {
    fundId: string;
    name?: string;
    amount?: number;
    fee?: number;
    totalCycles?: number;
  }) => fetchApi<any>("/funds/update", "POST", data),
  deleteFund: (id: string) => fetchApi<any>(`/funds/delete/${id}`, "POST"),
  deleteManyFunds: (ids: string[]) =>
    fetchApi<any>("/funds/delete-many", "POST", { ids }),
  closeFund: (id: string) => fetchApi<any>(`/funds/${id}/close`, "POST"),

  createFundWithMembers: (data: {
    name: string;
    amount: number;
    fee: number;
    totalCycles: number;
    startDate: string;
    players: { playerId: string; legs: number }[];
  }) => fetchApi<any>("/funds/with-members", "POST", data),

  // 4. Player-specific (chi tiết hụi)
  getPlayerFunds: (playerId: string) =>
    fetchApi<any[]>(`/players/${playerId}/funds`, "GET"),

  getFundDetailForPlayer: (playerId: string, fundId: string) =>
    fetchApi<any>(`/players/${playerId}/fund/${fundId}`, "GET"),

  claimCycle: (data: {
    playerId: string;
    fundId: string;
    cycleId: string;
    legsClaimed: number;
    paidAmount: number;
  }) => fetchApi<any>("/cycles/claim", "POST", data),

  unclaimCycle: (data: { fundId: string; cycleId: string }) =>
    fetchApi<any>("/cycles/unclaim", "POST", data),

  getStats: (date: string, type: "day" | "month" | "year") =>
    fetchApi<any>(`/cycles/stats?date=${date}&type=${type}`, "GET"),

  updatePaymentStatus: (cycleId: string, playerId: string, isPaid: boolean) =>
    fetchApi<any>(`/players/cycle/${cycleId}/payment/${playerId}`, "POST", {
      isPaid,
    }),
};

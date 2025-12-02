import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

export const QUERY_KEYS = {
  GROUPED_FUNDS: ["grouped-funds"],
  FUND_DETAIL: (id: string) => ["fund-detail", id],
  PLAYER_FUNDS: (playerId: string) => ["player-funds", playerId],
  PLAYER_FUND_DETAIL: (playerId: string, fundId: string) => [
    "player-fund-detail",
    playerId,
    fundId,
  ],
  ALL_PLAYERS: ["all-players"],
};

export const useGroupedFunds = () => {
  return useQuery({
    queryKey: QUERY_KEYS.GROUPED_FUNDS,
    queryFn: async () => {
      const res = await api.getGroupedFunds();
      if (!res.success) throw new Error(res.message || "Lỗi tải danh sách");
      return res.data;
    },
  });
};

export const useFundDetail = (fundId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.FUND_DETAIL(fundId),
    queryFn: async () => {
      const res = await api.getFundById(fundId);
      if (!res.success) throw new Error(res.message || "Lỗi tải chi tiết");
      return { ...res.data, id: res.data._id };
    },
    enabled: !!fundId,
  });
};

export const useFundDetailForPlayer = (playerId: string, fundId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PLAYER_FUND_DETAIL(playerId, fundId),
    queryFn: async () => {
      const res = await api.getFundDetailForPlayer(playerId, fundId);
      if (!res.success) throw new Error(res.message || "Lỗi tải chi tiết");
      return res.data;
    },
    enabled: !!playerId && !!fundId,
  });
};

export const useCreateFundMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.createFundWithMembers(payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPED_FUNDS });
    },
  });
};

export const useClaimCycleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      playerId: string;
      fundId: string;
      cycleId: string;
      legsClaimed: number;
      paidAmount: number;
    }) => {
      const res = await api.claimCycle(data);
      if (!res.success) throw new Error(res.message || "Hốt hụi thất bại");
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYER_FUND_DETAIL(
          variables.playerId,
          variables.fundId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FUND_DETAIL(variables.fundId),
      });
    },
  });
};

export const useUpdatePaymentStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      cycleId: string;
      playerId: string;
      isPaid: boolean;
      fundId: string;
    }) => {
      const res = await api.updatePaymentStatus(
        data.cycleId,
        data.playerId,
        data.isPaid
      );
      if (!res.success) throw new Error(res.message || "Cập nhật thất bại");
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FUND_DETAIL(variables.fundId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYER_FUND_DETAIL(
          variables.playerId,
          variables.fundId
        ),
      });
    },
  });
};

export const useUpdateFundMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      fundId: string;
      name?: string;
      amount?: number;
      fee?: number;
      totalCycles?: number;
    }) => {
      const res = await api.updateFund(data);
      if (!res.success) throw new Error(res.message || "Cập nhật thất bại");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPED_FUNDS });
      queryClient.invalidateQueries({ queryKey: ["fund-detail"] });
    },
  });
};

export const useDeleteFundMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.deleteFund(id);
      if (!res.success) throw new Error(res.message || "Xóa thất bại");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPED_FUNDS });
    },
  });
};

export const useDeleteManyFundsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.deleteManyFunds(ids);
      if (!res.success) throw new Error(res.message || "Xóa thất bại");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPED_FUNDS });
    },
  });
};

export const useCloseFundMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.closeFund(id);
      if (!res.success) throw new Error(res.message || "Thao tác thất bại");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GROUPED_FUNDS });
      queryClient.invalidateQueries({ queryKey: ["fund-detail"] });
    },
  });
};

export const useUnclaimCycleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      fundId: string;
      cycleId: string;
      // playerId: string;
    }) => {
      const res = await api.unclaimCycle(data);
      if (!res.success) throw new Error(res.message ?? "");
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fund-detail"] });
      window.location.reload();
    },
  });
};

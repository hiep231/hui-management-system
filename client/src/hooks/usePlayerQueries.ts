import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { QUERY_KEYS } from "./useFundQueries";
import { TModelPlayer } from "@/types/player";

export const useAllPlayers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ALL_PLAYERS,
    queryFn: async () => {
      const res = await api.getAllPlayers();
      if (!res.success) throw new Error(res.message || "Lỗi tải người chơi");
      return res.data.map((p: any) => ({ ...p, id: p._id })) as TModelPlayer[];
    },
  });
};

export const usePlayerFunds = (playerId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PLAYER_FUNDS(playerId),
    queryFn: async () => {
      const res = await api.getPlayerFunds(playerId);
      if (!res.success) throw new Error(res.message || "Lỗi tải dây hụi");
      return res.data.map((g: any) => ({ ...g, id: g._id }));
    },
    enabled: !!playerId,
  });
};

export const useCreatePlayerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await api.createPlayer(data.name);
      if (!res.success) throw new Error(res.message || "Thêm thất bại");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_PLAYERS });
    },
  });
};

export const useUpdatePlayerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; userName: string }) => {
      const res = await api.updatePlayer(data.id, {
        userName: data.userName,
      });
      if (!res.success) throw new Error(res.message || "Cập nhật thất bại");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_PLAYERS });
    },
  });
};

export const useDeletePlayerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.deletePlayer(id);
      if (!res.success) throw new Error(res.message || "Xóa thất bại");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_PLAYERS });
    },
  });
};

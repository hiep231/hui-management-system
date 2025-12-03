import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { CustomInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAllPlayers } from "@/hooks/usePlayerQueries";
import { Plus, Minus, Trash2, Search, User } from "lucide-react";
import { cn } from "@/utils";

type Props = {
  participants: any[];
  setParticipants: (val: any[]) => void;
};

const Step3Participants = ({ participants, setParticipants }: Props) => {
  const { data: players = [], isLoading } = useAllPlayers();
  const [searchTerm, setSearchTerm] = useState("");

  const totalLegs = participants.reduce((sum, p) => sum + p.legs, 0);

  const filteredPlayers = useMemo(() => {
    if (!searchTerm) return players;
    const lowerTerm = searchTerm.toLowerCase();
    return players.filter((p) => p.userName.toLowerCase().includes(lowerTerm));
  }, [players, searchTerm]);

  const handleUpdateLegs = (player: any, delta: number) => {
    const existingIndex = participants.findIndex(
      (p) => p.playerId === player.id
    );
    const newParticipants = [...participants];

    if (existingIndex >= 0) {
      const newLegs = newParticipants[existingIndex].legs + delta;
      if (newLegs <= 0) {
        newParticipants.splice(existingIndex, 1);
      } else {
        newParticipants[existingIndex].legs = newLegs;
      }
    } else if (delta > 0) {
      newParticipants.push({
        playerId: player.id,
        playerName: player.userName,
        legs: 1,
      });
    }
    setParticipants(newParticipants);
  };

  const getPlayerLegs = (playerId: string) => {
    const found = participants.find((p) => p.playerId === playerId);
    return found ? found.legs : 0;
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-40">
      <div className="sticky top-16 z-30 bg-gray-50 pb-2 pt-1">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            className="flex-1 outline-none text-base bg-transparent"
            placeholder="Tìm tên hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            Đang tải danh bạ...
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed">
            <User className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>Không tìm thấy người chơi nào.</p>
          </div>
        ) : (
          filteredPlayers.map((player) => {
            const legs = getPlayerLegs(player.id);
            const isSelected = legs > 0;

            return (
              <div
                key={player.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all duration-200",
                  isSelected
                    ? "bg-blue-50 border-blue-500 shadow-md translate-x-1"
                    : "bg-white border-gray-200 shadow-sm"
                )}
              >
                <div
                  className="flex-1 min-w-0 pr-4 cursor-pointer"
                  onClick={() => !isSelected && handleUpdateLegs(player, 1)}
                >
                  <div>
                    <h4
                      className={cn(
                        "font-bold text-base truncate",
                        isSelected ? "text-blue-900" : "text-gray-800"
                      )}
                    >
                      {player.userName}
                    </h4>
                    {isSelected && (
                      <p className="text-xs text-blue-600 font-medium">
                        Đã chọn tham gia
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {isSelected ? (
                    <div className="flex items-center bg-white rounded-xl border border-blue-100 shadow-sm p-1">
                      <button
                        onClick={() => handleUpdateLegs(player, -1)}
                        className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg active:scale-90 transition-transform"
                      >
                        {legs === 1 ? (
                          <Trash2 size={18} />
                        ) : (
                          <Minus size={20} />
                        )}
                      </button>

                      <span className="w-10 text-center font-bold text-lg text-blue-700">
                        {legs}
                      </span>

                      <button
                        onClick={() => handleUpdateLegs(player, 1)}
                        className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg active:scale-90 transition-transform"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => handleUpdateLegs(player, 1)}
                      className="!h-10 !w-10 !p-0 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-400 hover:text-blue-500"
                    >
                      <Plus size={24} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div
        className={cn(
          "fixed bottom-[88px] left-4 right-4 z-40 p-4 rounded-2xl shadow-xl border flex justify-between items-center backdrop-blur-md transition-colors duration-300",
          totalLegs === 12
            ? "bg-green-500/95 border-green-600 text-white"
            : totalLegs > 12
            ? "bg-red-500/95 border-red-600 text-white"
            : "bg-gray-900/90 border-gray-700 text-white"
        )}
      >
        <div>
          <p className="text-xs opacity-80 font-medium uppercase tracking-wider">
            Tổng số chân
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{totalLegs}</span>
            <span className="text-sm opacity-60">/ 12</span>
          </div>
        </div>

        <div className="text-right">
          {totalLegs === 12 && (
            <span className="flex items-center gap-1 font-bold">
              <span className="text-xl">🎉</span> Đã đủ!
            </span>
          )}
          {totalLegs < 12 && (
            <span className="font-medium text-orange-300">
              Thiếu {12 - totalLegs} chân
            </span>
          )}
          {totalLegs > 12 && (
            <span className="font-medium text-white bg-red-700 px-2 py-1 rounded text-xs">
              Dư {totalLegs - 12}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3Participants;

import Title from "@/components/ui/Typography";
import CardUser from "./CardUser";
import { useAllPlayers } from "@/hooks/usePlayerQueries";
import { useRecoilValue } from "recoil";
import { childHuiGroupsAtom } from "@/modules/recoil-utils/utils.recoil";
import { useState, useMemo } from "react";
import { Search, UserX } from "lucide-react";

const ListUser = () => {
  const { data: players = [], isLoading } = useAllPlayers();
  const childGroups = useRecoilValue(childHuiGroupsAtom);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase().trim();
    if (!lowerTerm) return players;

    return players.filter((player) => {
      const name = player.userName?.toLowerCase() || "";
      return name.includes(lowerTerm);
    });
  }, [players, searchTerm]);

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-500 mb-4 sticky top-[calc(var(--zaui-safe-area-inset-top)+60px+7px)] z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-none border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="pb-20">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredPlayers.map((player) => {
              const playerGroups = childGroups.filter((group) =>
                group.members?.some((m) => m.player.toString() === player.id)
              );
              return (
                <CardUser
                  key={player.id}
                  player={player}
                  playerGroups={playerGroups}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <UserX size={32} className="opacity-40" />
            </div>
            <p className="font-medium">Không tìm thấy người chơi.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ListUser;

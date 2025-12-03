import { TModelPlayer } from "@/types/player";
import { User, CheckCircle2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { getSafeId } from "@/utils";
import Title from "@/components/ui/Typography";

type TSelectWinnerModalProps = {
  members: any[];
  cycles: any[];
  targetCycleNumber: number;
  currentCycleClaimers?: any[];
  onSelect: (member: any) => void;
};

const SelectWinnerModal = ({
  members,
  cycles = [],
  targetCycleNumber,
  currentCycleClaimers = [],
  onSelect,
}: TSelectWinnerModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const sortedMembers = useMemo(() => {
    return members
      .map((m) => {
        const playerId = getSafeId(m.player);

        const pastClaimedCount = cycles
          .filter((c) => c.cycleNumber < targetCycleNumber)
          .reduce((total, cycle) => {
            const winners = cycle.claimers || [];
            const winRecord = winners.find(
              (w: any) => getSafeId(w.player) === playerId
            );
            return total + (winRecord ? winRecord.legsClaimed || 1 : 0);
          }, 0);

        const currentClaimingCount = currentCycleClaimers
          .filter((c) => getSafeId(c.player) === playerId)
          .reduce((sum, c) => sum + (c.legsClaimed || 1), 0);

        const realLiveLegs =
          m.initialLegs - pastClaimedCount - currentClaimingCount;

        return {
          ...m,
          realLiveLegs: Math.max(0, realLiveLegs),
        };
      })
      .filter((m) => {
        const player = m.player as unknown as TModelPlayer;
        const name = player.userName?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();
        return name.includes(search);
      })
      .sort((a, b) => {
        if (a.realLiveLegs > 0 && b.realLiveLegs === 0) return -1;
        if (a.realLiveLegs === 0 && b.realLiveLegs > 0) return 1;
        return 0;
      });
  }, [members, searchTerm, currentCycleClaimers, cycles, targetCycleNumber]);

  return (
    <div className="bg-white rounded-lg w-full max-w-md flex flex-col max-h-[80vh]">
      <div className="p-4 border-b">
        <Title className="text-center text-primary">
          Chọn người hốt (Kỳ {targetCycleNumber})
        </Title>
        <input
          type="text"
          placeholder="Tìm tên hoặc số điện thoại..."
          className="w-full mt-3 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-y-auto flex-1 p-2 space-y-2">
        {sortedMembers.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            Không tìm thấy thành viên phù hợp
          </div>
        ) : (
          sortedMembers.map((member) => {
            const player = member.player as unknown as TModelPlayer;
            const playerId = getSafeId(player);
            const canClaim = member.realLiveLegs > 0;

            return (
              <div
                key={playerId}
                onClick={() => canClaim && onSelect(member)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  canClaim
                    ? "bg-white border-gray-200 hover:border-primary hover:bg-blue-50 cursor-pointer shadow-sm active:scale-[0.98]"
                    : "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold ${
                      canClaim
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {player.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-800 truncate">
                      {player.userName}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-2">
                  {canClaim ? (
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Còn {member.realLiveLegs}{" "}
                        chân
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-50 px-2 py-1 rounded">
                      <XCircle size={12} /> Hết lượt
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SelectWinnerModal;

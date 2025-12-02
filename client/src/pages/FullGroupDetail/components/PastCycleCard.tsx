import { getSafeId } from "@/utils";
import { Crown, CheckCircle2 } from "lucide-react";

type Props = {
  cycle: any;
  members: any[];
};

const PastCycleCard = ({ cycle, members }: Props) => {
  const winnerId = cycle.claimerId || cycle.claimerDetail?.player;

  const winnerName =
    members.find((m: any) => getSafeId(m.player) === getSafeId(winnerId))
      ?.player?.userName || "Không rõ";

  return (
    <div className="mb-2 bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all relative overflow-hidden group">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>

      <div className="flex items-center gap-3 pl-2">
        <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center text-sm font-bold text-green-700">
          {cycle.cycleNumber}
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <Crown size={14} className="text-orange-500 fill-orange-500" />
            <p className="text-sm font-bold text-gray-800 group-hover:text-green-700 transition-colors">
              {winnerName}
            </p>
          </div>
          <p className="text-[10px] text-gray-500 uppercase font-medium mt-0.5">
            Đã hoàn tất
          </p>
        </div>
      </div>

      <div className="pr-1 text-green-600 opacity-50 group-hover:opacity-100">
        <CheckCircle2 size={18} />
      </div>
    </div>
  );
};

export default PastCycleCard;

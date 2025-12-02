import { Layers, Users, TrendingUp } from "lucide-react";
import { useGroupedFunds } from "@/hooks/useFundQueries";
import { useAllPlayers } from "@/hooks/usePlayerQueries";
import { formatCompactNumber } from "@/utils";

const StatsOverview = () => {
  const { data: groupedFunds = [] } = useGroupedFunds();
  const { data: players = [] } = useAllPlayers();

  const totalMoneyManaged = groupedFunds.reduce((sum: number, group: any) => {
    return sum + group._id.amount * group.count * 12;
  }, 0);

  return (
    <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-2xl p-5 text-white shadow-lg mb-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1 opacity-90">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Tổng quy mô hụi</span>
        </div>
        <h2 className="text-3xl font-bold mb-6 tracking-tight">
          {(totalMoneyManaged / 1000000).toLocaleString("vi-VN")}{" "}
          <span className="text-lg font-normal">Triệu</span>
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">
                {groupedFunds.length}
              </p>
              <p className="text-xs opacity-80 mt-1">Dây đang chạy</p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">
                {players.length}
              </p>
              <p className="text-xs opacity-80 mt-1">Thành viên</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;

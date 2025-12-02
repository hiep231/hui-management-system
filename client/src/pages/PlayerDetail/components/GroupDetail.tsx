import Title from "@/components/ui/Typography";
import { usePropsPassDown } from "@/providers/PropsPass/hook";
import { TPropsDownPlayerDetail } from "..";
import CardMonthUser from "./CardMonthUser";
import { useFundDetailForPlayer } from "@/hooks/useFundQueries";
import { Archive, UserCheck } from "lucide-react";

const GroupDetail = () => {
  const { selectedPlayer, activeChildGroup } =
    usePropsPassDown<TPropsDownPlayerDetail>();

  const { data: fundDetails, isLoading } = useFundDetailForPlayer(
    selectedPlayer?.id,
    activeChildGroup?.id
  );

  if (isLoading)
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );

  if (!fundDetails)
    return (
      <div className="p-8 text-center text-gray-400">
        Không có dữ liệu chi tiết.
      </div>
    );

  const playerParticipation = fundDetails.playerDetails;
  const cycles = fundDetails.cycles || [];

  const totalLegs = playerParticipation?.initialLegs || 0;
  const totalClaimed = playerParticipation?.legsClaimed || 0;
  const legsRemaining = totalLegs - totalClaimed;

  const getMonthStatus = (cycle: any) => {
    if (cycle.isClaimedByMe) return "drawn";
    if (cycle.claimerId) return "lost";
    return "not-drawn";
  };

  const sortedCycles = [...cycles].sort((a, b) => {
    return a.cycleNumber - b.cycleNumber;
  });

  return (
    <div className="pb-20">
      <div className="mx-4 mt-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              {activeChildGroup?.name}
            </h3>
            <p className="text-xs text-gray-500">Thông tin tham gia</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-xl">
            {totalLegs} <span className="text-xs font-normal">chân</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full shadow-sm">
              <UserCheck size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-green-700">
                {legsRemaining}
              </p>
              <p className="text-[10px] text-green-800 uppercase font-bold">
                Chân sống
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full shadow-sm">
              <Archive size={18} className="text-gray-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-700">{totalClaimed}</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                Đã hốt
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <Title className="mb-3 text-base">Lịch sử các kỳ</Title>
        <div className="space-y-3">
          {sortedCycles.map((cycle: any) => (
            <CardMonthUser
              key={cycle.cycleNumber}
              monthIndex={cycle.cycleNumber}
              cycleData={cycle}
              monthStatus={getMonthStatus(cycle)}
              legsRemaining={legsRemaining}
              totalClaimed={totalClaimed}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;

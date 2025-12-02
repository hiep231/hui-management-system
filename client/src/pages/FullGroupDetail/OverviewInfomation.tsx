import { usePropsPassDown } from "@/providers/PropsPass/hook";
import { TPropsDownGroupDetail } from ".";
import { Banknote, Calendar, Users, Info } from "lucide-react";
import { dayjsVN } from "@/utils/dayjsVN";
import { formatCompactNumber } from "@/utils";

const OverviewInfomation = () => {
  const { selectedGroup, parentGroup } =
    usePropsPassDown<TPropsDownGroupDetail>();

  const startDate = dayjsVN(selectedGroup.startDate).format("DD/MM/YYYY");
  const totalParticipants = selectedGroup.members.length;
  const activeCycle =
    selectedGroup.cycles.find((c) => !c.closed)?.cycleNumber || "Hoàn tất";

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      {/* Dòng 1: Số tiền (Quan trọng nhất) */}
      <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-3">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase mb-1">
            Dây hụi
          </p>
          <p className="text-xl font-bold text-primary">
            {formatCompactNumber(parentGroup.amount)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-medium uppercase mb-1">
            Tiền thảo
          </p>
          <p className="text-lg font-bold text-orange-500">
            {formatCompactNumber(parentGroup.thaoAmount)}
          </p>
        </div>
      </div>

      {/* Dòng 2: Các thông số phụ (Grid) */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-500 mb-1 flex justify-center items-center gap-1">
            <Calendar size={12} /> Ngày mở
          </p>
          <p className="font-semibold text-sm text-gray-800">{startDate}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-500 mb-1 flex justify-center items-center gap-1">
            <Users size={12} /> Thành viên
          </p>
          <p className="font-semibold text-sm text-gray-800">
            {totalParticipants}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
          <p className="text-xs text-blue-600 mb-1 flex justify-center items-center gap-1">
            <Info size={12} /> Kỳ hiện tại
          </p>
          <p className="font-bold text-sm text-blue-700">{activeCycle}</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewInfomation;

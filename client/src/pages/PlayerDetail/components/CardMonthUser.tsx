import { usePropsPassDown } from "@/providers/PropsPass/hook";
import eventBus from "@/utils/bus";
import { TPropsDownPlayerDetail } from "..";
import HotModal from "./HotModal";
import { TModelParentGroups } from "@/types";
import { Lock, Check, AlertCircle, Trophy, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils";

type TCardMonthUserProps = {
  monthIndex: number;
  cycleData: any;
  monthStatus: string;
  legsRemaining: number;
  totalClaimed: number;
};

const CardMonthUser = ({
  monthIndex,
  cycleData,
  monthStatus,
  legsRemaining,
}: TCardMonthUserProps) => {
  const { selectedPlayer, activeChildGroup, activeParentGroup } =
    usePropsPassDown<TPropsDownPlayerDetail>();

  const isMeClaimed = monthStatus === "drawn";
  const isSomeoneElseClaimed = !!cycleData.claimerId && !isMeClaimed;
  const isOpen = !cycleData.claimerId;

  const isPaid = cycleData.paymentStatus === "PAID";
  const amountDue = cycleData.amountDue || 0;

  const onClickHot = () => {
    eventBus.emit(
      "open-popup",
      <HotModal
        data={{
          monthIndex: cycleData.cycleNumber,
          cycleId: cycleData.cycleId,
          maxLegsCanClaim: legsRemaining,
        }}
        childGroup={activeChildGroup}
        selectedPlayer={selectedPlayer}
        parentGroup={activeParentGroup as TModelParentGroups}
        onSuccess={() => window.location.reload()}
      />
    );
  };

  if (isMeClaimed) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-xl p-4 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
          ĐÃ HỐT KỲ NÀY
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-orange-200 shadow-sm text-orange-500">
            <Trophy size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase">
              Thực nhận về
            </p>
            <p className="text-xl font-bold text-orange-700">
              +{cycleData.amountReceivedByClaimer?.toLocaleString()}đ
            </p>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-orange-200/50 flex justify-between text-xs text-gray-600">
          <span>
            Bỏ thăm:{" "}
            <b className="text-red-500">
              -{cycleData.claimerPaidAmountB?.toLocaleString()}đ
            </b>
          </span>
          <span>Kỳ {monthIndex}</span>
        </div>
      </div>
    );
  }

  if (isOpen) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-sm font-bold">
            {monthIndex}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">Kỳ {monthIndex}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Lock size={10} /> Chưa mở
            </p>
          </div>
        </div>

        {legsRemaining > 0 && (
          <Button
            size="small"
            onClick={onClickHot}
            className="!py-1 !px-3 !h-8 text-xs bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 shadow-sm"
          >
            Đăng ký hốt
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-xl p-4 border transition-all shadow-sm",
        isPaid
          ? "bg-gray-50 border-gray-200 opacity-70"
          : "bg-white border-red-200 border-l-4 border-l-red-500"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-800">
            Kỳ {monthIndex}
          </span>
          {isPaid ? (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              <Check size={10} strokeWidth={4} /> ĐÃ ĐÓNG
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse">
              <AlertCircle size={10} /> CẦN ĐÓNG
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Phải đóng</p>
          <p
            className={cn(
              "text-lg font-bold",
              isPaid ? "text-gray-600" : "text-red-600"
            )}
          >
            {amountDue.toLocaleString()}đ
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-dashed border-gray-200">
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
          <Wallet size={12} className="text-gray-500" />
        </div>
        <span className="text-xs text-gray-500">
          Người hốt:{" "}
          <span className="font-medium text-gray-700">Thành viên khác</span>
        </span>
      </div>
    </div>
  );
};

export default CardMonthUser;

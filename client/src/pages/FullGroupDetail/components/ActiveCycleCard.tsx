import { Button } from "@/components/ui/Button";
import { cn, formatCompactNumber, getSafeId } from "@/utils";
import {
  CheckCircle2,
  Crown,
  Plus,
  Trash2,
  User,
  Calculator,
  PlusCircle,
} from "lucide-react";
import { useMemo } from "react";

type Props = {
  cycle: any;
  members: any[];
  group: any;
  onSelectWinner: () => void;
  onUpdatePayment: (member: any, amount: number, isPaid: boolean) => void;
  onUnclaim: (claimer: any) => void;
};

const ActiveCycleCard = ({
  cycle,
  members,
  group,
  onSelectWinner,
  onUpdatePayment,
  onUnclaim,
}: Props) => {
  const claimers = cycle.claimers || [];
  const hasWinner = claimers.length > 0;

  const currentBid = hasWinner ? claimers[0].paidAmount || 0 : 0;
  const baseAmount = group.amount;

  // --- LOGIC TÍNH TOÁN CỐT LÕI ---
  const paymentList = useMemo(() => {
    const allCycles = group.cycles || [];
    const pastCycles = allCycles.filter(
      (c: any) => c.cycleNumber < cycle.cycleNumber
    );

    return members
      .map((member) => {
        const memberId = getSafeId(member.player);
        const totalLegs = member.initialLegs;

        // Đếm số chân ĐÃ HỐT ở các kỳ TRƯỚC
        let deadLegsCount = 0;
        pastCycles.forEach((c: any) => {
          const winners = c.claimers || [];
          winners.forEach((w: any) => {
            if (getSafeId(w.player) === memberId) {
              deadLegsCount += w.legsClaimed || 1;
            }
          });
        });

        // Đếm số chân ĐANG HỐT ở kỳ NÀY
        let winningLegsNow = 0;
        claimers.forEach((w: any) => {
          if (getSafeId(w.player) === memberId) {
            winningLegsNow += w.legsClaimed || 1;
          }
        });

        // Số chân SỐNG còn lại
        const aliveLegsCount = Math.max(
          0,
          totalLegs - deadLegsCount - winningLegsNow
        );

        // TÍNH TIỀN
        const deadAmount = deadLegsCount * baseAmount;
        const aliveAmount = aliveLegsCount * (baseAmount - currentBid);
        const totalAmountDue = deadAmount + aliveAmount;

        const paymentRecord = cycle.payments?.find(
          (p: any) => getSafeId(p.player) === memberId
        );
        const isPaid = paymentRecord ? paymentRecord.isPaid : false;

        return {
          member,
          memberId,
          totalLegs,
          deadLegsCount,
          aliveLegsCount,
          winningLegsNow,
          totalAmountDue,
          isPaid,
          shouldShow: totalAmountDue > 0,
        };
      })
      .filter((item) => item.shouldShow)
      .sort((a, b) => {
        if (a.isPaid === b.isPaid) return 0;
        return a.isPaid ? 1 : -1;
      });
  }, [group, members, cycle, claimers, currentBid, baseAmount]);

  const totalRevenueExpected = paymentList.reduce(
    (sum, item) => sum + item.totalAmountDue,
    0
  );
  const totalRevenueCollected = paymentList
    .filter((i) => i.isPaid)
    .reduce((sum, item) => sum + item.totalAmountDue, 0);
  const progress =
    totalRevenueExpected > 0
      ? (totalRevenueCollected / totalRevenueExpected) * 100
      : 0;

  return (
    <div className="mb-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-500 overflow-hidden">
        {/* --- 1. KHU VỰC NGƯỜI HỐT (WINNER) --- */}
        <div className="border-b border-gray-100 bg-blue-50/30">
          {!hasWinner ? (
            <div className="p-4 text-center">
              <div className="inline-block p-2 bg-blue-100 rounded-full text-blue-600 mb-2">
                <Calculator size={20} />
              </div>
              <h4 className="font-bold text-gray-800">
                Chưa xác định người hốt
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Hệ thống đang tạm tính tất cả là Hụi Chết.
              </p>
              <Button
                onClick={onSelectWinner}
                variant="primary"
                className="h-8 text-xs px-4 mx-auto"
              >
                <Plus size={14} className="mr-1" /> Chọn người hốt
              </Button>
            </div>
          ) : (
            <div className="p-0">
              {/* HEADER DANH SÁCH NGƯỜI HỐT - ĐÃ THÊM NÚT ADD */}
              <div className="px-4 py-2 bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>🏆 Người hốt ({claimers.length})</span>
                </div>
                <button
                  onClick={onSelectWinner}
                  className="bg-white text-orange-600 hover:bg-orange-200 p-1 rounded-md shadow-sm transition-colors border border-orange-200"
                  title="Thêm người hốt nữa"
                >
                  <Plus size={12} strokeWidth={3} />
                </button>
              </div>

              {claimers.map((winnerInfo: any, index: number) => {
                const winnerMember = members.find(
                  (m) => getSafeId(m.player) === getSafeId(winnerInfo.player)
                );
                return (
                  <div
                    key={index}
                    className="p-3 border-b border-orange-100 last:border-0 bg-gradient-to-r from-white to-orange-50 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center bg-white text-orange-600 font-bold shadow-sm">
                        {winnerMember?.player?.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                          {winnerMember?.player?.userName}
                        </h4>
                        <div className="flex gap-2 text-[10px] mt-0.5">
                          <span className="bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded">
                            Hốt {winnerInfo.legsClaimed || 1} chân
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-green-600 font-bold text-base">
                        +{formatCompactNumber(winnerInfo.amountReceived)}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm("Bạn muốn hủy lượt hốt này?"))
                            onUnclaim(winnerInfo);
                        }}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* --- 2. TIẾN ĐỘ --- */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">
                Cần thu
              </p>
              <p className="text-base font-bold text-blue-700">
                {formatCompactNumber(totalRevenueExpected)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Đã thu:{" "}
                <b className="text-green-600">
                  {formatCompactNumber(totalRevenueCollected)}
                </b>
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* --- 3. DANH SÁCH ĐÓNG TIỀN --- */}
        <div className="max-h-[450px] overflow-y-auto bg-white">
          {paymentList.map((item) => (
            <div
              key={item.memberId}
              onClick={() =>
                onUpdatePayment(item.member, item.totalAmountDue, !item.isPaid)
              }
              className={cn(
                "flex items-center justify-between p-3 border-b border-gray-100 transition-all cursor-pointer select-none active:scale-[0.99]",
                item.isPaid ? "bg-green-50/40" : "hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
                    item.isPaid
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300"
                  )}
                >
                  {item.isPaid && <CheckCircle2 size={14} />}
                </div>

                <div className="min-w-0">
                  <p
                    className={cn(
                      "font-bold text-sm",
                      item.isPaid ? "text-gray-500" : "text-gray-800"
                    )}
                  >
                    {item.member.player.userName}
                  </p>
                  <div className="text-[10px] text-gray-500 flex gap-1.5 mt-0.5">
                    {item.deadLegsCount > 0 && (
                      <span className="bg-gray-100 px-1.5 rounded text-gray-600">
                        {item.deadLegsCount} Chết
                      </span>
                    )}
                    {item.aliveLegsCount > 0 && (
                      <span className="bg-blue-50 px-1.5 rounded text-blue-600">
                        {item.aliveLegsCount} Sống
                      </span>
                    )}
                    {item.winningLegsNow > 0 && (
                      <span className="bg-orange-100 text-orange-700 px-1.5 rounded">
                        Đang hốt
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={cn(
                    "font-bold text-base",
                    item.isPaid ? "text-green-600 opacity-70" : "text-gray-900"
                  )}
                >
                  {formatCompactNumber(item.totalAmountDue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveCycleCard;

import { useState, useEffect } from "react";
import { TModelChildGroup, TModelParentGroups } from "@/types";
import { TModelPlayer } from "@/types/player";
import eventBus from "@/utils/bus";
import SelectWinnerModal from "./SelectWinnerModal";
import HotModal from "../PlayerDetail/components/HotModal";
import {
  useUpdatePaymentStatusMutation,
  useUnclaimCycleMutation,
} from "@/hooks/useFundQueries";
import { useSnackbar, Modal } from "zmp-ui";
import { getSafeId } from "@/utils";
import ActiveCycleCard from "./components/ActiveCycleCard";
import { ChevronDown, ChevronRight, Lock, CheckCircle2 } from "lucide-react";

const VerticalCycleList = ({ group }: { group: TModelChildGroup }) => {
  const cycles = group.cycles || [];
  const members = group.members || [];
  // Sắp xếp kỳ: 1 -> 12
  const sortedCycles = [...cycles].sort(
    (a, b) => a.cycleNumber - b.cycleNumber
  );

  // Tìm kỳ hiện tại (kỳ đầu tiên chưa đóng)
  const activeCycleIndex = sortedCycles.findIndex((c) => !c.closed);
  const activeCycleNumber =
    activeCycleIndex !== -1 ? sortedCycles[activeCycleIndex].cycleNumber : -1;

  // State: Kỳ nào đang được mở rộng để xem chi tiết? (Mặc định là kỳ hiện tại)
  const [expandedCycleNum, setExpandedCycleNum] =
    useState<number>(activeCycleNumber);

  const { openSnackbar } = useSnackbar();
  const { mutate: updatePayment } = useUpdatePaymentStatusMutation();
  const { mutate: unclaimCycle } = useUnclaimCycleMutation();

  // Modal states
  const [confirmPayment, setConfirmPayment] = useState<any>(null);
  const [confirmUnclaim, setConfirmUnclaim] = useState<any>(null);

  useEffect(() => {
    if (activeCycleNumber !== -1) {
      setExpandedCycleNum(activeCycleNumber);
    }
  }, [activeCycleNumber]);

  const handleSelectWinner = (cycle: any) => {
    const currentClaimers = cycle.claimers || [];

    eventBus.emit(
      "open-popup",
      <SelectWinnerModal
        members={members}
        // --- CẬP NHẬT 2 DÒNG NÀY ---
        cycles={cycles} // Truyền toàn bộ lịch sử
        targetCycleNumber={cycle.cycleNumber} // Truyền kỳ đang chọn (ví dụ: 2)
        // ---------------------------

        currentCycleClaimers={currentClaimers}
        onSelect={(selectedMember) => {
          const player = selectedMember.player as unknown as TModelPlayer;

          // Logic tính maxLegsCanClaim cũng cần chính xác tuyệt đối như trong Modal
          // (Dùng lại logic realLiveLegs từ selectedMember đã được tính trong Modal trả ra)
          // Lưu ý: selectedMember ở đây là object từ mảng sortedMembers trong Modal, nên nó ĐÃ CÓ realLiveLegs rồi
          const legsRemaining = (selectedMember as any).realLiveLegs;

          const fakeParentGroup: TModelParentGroups = {
            id: group.parentId || "",
            name: group.name,
            amount: group.amount,
            thaoAmount: group.fee,
            createdDate: group.startDate,
            totalParticipants: members.length,
            totalLegs: group.totalLegsRegistered || 12,
          };

          eventBus.emit(
            "open-popup",
            <HotModal
              data={{
                monthIndex: cycle.cycleNumber,
                cycleId: cycle.cycleId || cycle._id,
                maxLegsCanClaim: legsRemaining,
              }}
              childGroup={group}
              selectedPlayer={{ ...player, id: getSafeId(player) }}
              parentGroup={fakeParentGroup}
              onSuccess={() => window.location.reload()}
            />
          );
        }}
      />
    );
  };

  const handleUpdatePayment = (
    member: any,
    amount: number,
    isPaid: boolean
  ) => {
    const currentCycle = sortedCycles.find(
      (c) => c.cycleNumber === expandedCycleNum
    );
    if (isPaid) {
      setConfirmPayment({ member, amount, isPaid });
    } else {
      updatePayment(
        {
          cycleId: currentCycle?._id,
          playerId: getSafeId(member.player),
          isPaid: false,
          fundId: group.id,
        },
        {
          onSuccess: () =>
            openSnackbar({ text: "Đã hoàn tác!", type: "success" }),
          onError: () => openSnackbar({ text: "Lỗi", type: "error" }),
        }
      );
    }
  };

  const confirmPay = () => {
    if (!confirmPayment) return;
    const currentCycle = sortedCycles.find(
      (c) => c.cycleNumber === expandedCycleNum
    );
    updatePayment(
      {
        cycleId: currentCycle?._id,
        playerId: getSafeId(confirmPayment.member.player),
        isPaid: true,
        fundId: group.id,
      },
      {
        onSuccess: () => {
          openSnackbar({ text: "Đã thu tiền", type: "success" });
          setConfirmPayment(null);
        },
        onError: () => openSnackbar({ text: "Lỗi", type: "error" }),
      }
    );
  };

  const confirmUnclaimAction = () => {
    if (!confirmUnclaim) return;
    unclaimCycle(
      { fundId: group.id, cycleId: confirmUnclaim.cycleId },
      {
        onSuccess: () => {
          openSnackbar({ text: "Đã hủy", type: "success" });
          setConfirmUnclaim(null);
        },
        onError: (err) => openSnackbar({ text: err.message, type: "error" }),
      }
    );
  };

  return (
    <div className="pb-20 pt-2 space-y-3">
      <h3 className="font-bold text-gray-700 px-1">Danh sách kỳ hụi</h3>

      {sortedCycles.map((cycle) => {
        const isExpanded = cycle.cycleNumber === expandedCycleNum;
        const isFuture =
          cycle.cycleNumber > activeCycleNumber && activeCycleNumber !== -1;
        const isPast = cycle.cycleNumber < activeCycleNumber;

        // Render Card Header (Trạng thái thu gọn)
        const CollapsedCard = (
          <div
            onClick={() =>
              setExpandedCycleNum(isExpanded ? -1 : cycle.cycleNumber)
            }
            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
              isExpanded ? "hidden" : "flex bg-white border-gray-100 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isPast
                    ? "bg-green-100 text-green-700"
                    : isFuture
                    ? "bg-gray-100 text-gray-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {cycle.cycleNumber}
              </div>
              <div>
                <p
                  className={`font-bold text-sm ${
                    isFuture ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Kỳ thứ {cycle.cycleNumber}
                </p>
                <p className="text-xs text-gray-400">
                  {isPast
                    ? "Đã hoàn tất"
                    : isFuture
                    ? "Chưa mở"
                    : "Đang diễn ra"}
                </p>
              </div>
            </div>

            {isPast && <CheckCircle2 size={18} className="text-green-500" />}
            {isFuture && <Lock size={16} className="text-gray-300" />}
            {!isPast && !isFuture && (
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            )}
          </div>
        );

        return (
          <div key={cycle.cycleNumber}>
            {/* Nếu đang mở -> Hiện Full Card, ngược lại hiện Card thu gọn */}
            {isExpanded ? (
              <div className="relative">
                {/* Nút thu gọn */}
                <div
                  onClick={() => setExpandedCycleNum(-1)}
                  className="flex items-center gap-2 mb-2 px-2 cursor-pointer text-gray-500 hover:text-primary"
                >
                  <ChevronDown size={16} />
                  <span className="text-xs font-bold uppercase">
                    Đang xem Kỳ {cycle.cycleNumber}
                  </span>
                </div>

                <ActiveCycleCard
                  cycle={cycle}
                  members={members}
                  group={group}
                  onSelectWinner={() => handleSelectWinner(cycle)}
                  onUpdatePayment={handleUpdatePayment}
                  onUnclaim={(claimer) =>
                    setConfirmUnclaim({
                      cycleId: cycle._id,
                      playerId: getSafeId(claimer.player),
                    })
                  }
                />
              </div>
            ) : (
              CollapsedCard
            )}
          </div>
        );
      })}

      {/* Modals */}
      <Modal
        visible={!!confirmPayment}
        title="Xác nhận thu tiền"
        onClose={() => setConfirmPayment(null)}
        actions={[
          { text: "Hủy", close: true },
          { text: "Xác nhận", highLight: true, onClick: confirmPay },
        ]}
      >
        <div className="text-center p-4">
          Xác nhận <b>{confirmPayment?.member?.player?.userName}</b> đóng{" "}
          <span className="text-primary font-bold">
            {confirmPayment?.amount?.toLocaleString()}đ
          </span>
        </div>
      </Modal>

      <Modal
        visible={!!confirmUnclaim}
        title="Hủy kỳ này?"
        onClose={() => setConfirmUnclaim(null)}
        actions={[
          { text: "Thoát", close: true },
          { text: "Hủy ngay", danger: true, onClick: confirmUnclaimAction },
        ]}
      >
        <div className="text-center p-4 text-gray-600">
          Dữ liệu đóng tiền của kỳ này sẽ bị xóa sạch.
        </div>
      </Modal>
    </div>
  );
};

export default VerticalCycleList;

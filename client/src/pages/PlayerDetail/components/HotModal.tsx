import Title from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { NumberInput } from "@/components/ui/NumberInput";
import { TModelParentGroups } from "@/types";
import { TModelPlayer } from "@/types/player";
import { calculateReceiveAmount } from "@/utils";
import eventBus from "@/utils/bus";
import { useMemo, useState } from "react";
import { useSnackbar } from "zmp-ui";
import { useClaimCycleMutation } from "@/hooks/useFundQueries";

interface IProp {
  data: {
    monthIndex: number;
    cycleId: string;
    maxLegsCanClaim: number;
  };
  childGroup: any;
  selectedPlayer: TModelPlayer;
  parentGroup: TModelParentGroups;
  onSuccess?: () => void;
}

const HotModal = ({
  data,
  childGroup,
  selectedPlayer,
  parentGroup,
  onSuccess,
}: IProp) => {
  const maxLegs = data.maxLegsCanClaim > 0 ? data.maxLegsCanClaim : 1;

  const [hotForm, setHotForm] = useState({
    month: data.monthIndex,
    legs: 1,
    bidAmount: 0,
    cycleId: data.cycleId,
  });

  const { openSnackbar } = useSnackbar();
  const { mutateAsync, isPending } = useClaimCycleMutation();

  const { month, legs: hotLegs, bidAmount } = hotForm;

  const isLegsValid = hotLegs > 0 && hotLegs <= maxLegs;

  const computedValues = useMemo(() => {
    const A = parentGroup.amount;
    const B = bidAmount || 0;
    const C = 12 - month;
    const D = month - 1;
    const E = parentGroup?.thaoAmount;
    const F = hotLegs || 0;

    const currentPlayerMember = childGroup.members.find(
      (m: any) =>
        m.player.id === selectedPlayer.id || m.player._id === selectedPlayer.id
    );
    const initialLegs = currentPlayerMember?.initialLegs || 0;
    const G = Math.max(0, initialLegs - F);

    const receiveAmount = calculateReceiveAmount(A, B, C, D, E, F, G);

    return { A, B, C, D, E, F, G, receiveAmount };
  }, [
    parentGroup?.amount,
    parentGroup?.thaoAmount,
    month,
    bidAmount,
    hotLegs,
    childGroup.members,
    selectedPlayer.id,
  ]);

  const closeModal = () => {
    eventBus.emit("close-popup");
  };

  const processHot = async () => {
    if (!isLegsValid) {
      openSnackbar({
        text: `Bạn chỉ còn ${maxLegs} chân để hốt!`,
        type: "error",
      });
      return;
    }

    try {
      await mutateAsync({
        playerId: selectedPlayer.id,
        fundId: childGroup.id,
        cycleId: hotForm.cycleId,
        legsClaimed: hotForm.legs,
        paidAmount: hotForm.bidAmount,
      });

      openSnackbar({ text: "Hốt hụi thành công!", type: "success" });
      onSuccess?.();
      eventBus.emit("close-popup");
    } catch (error: any) {
      openSnackbar({ text: error.message, type: "error" });
    }
  };

  return (
    <div className="bg-white rounded-md p-4 w-full max-w-md">
      <Title className="mb-3 text-center text-primary font-bold text-xl">
        Hốt hụi tháng {month}
      </Title>

      <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-800 border border-blue-100">
        Người chơi: <b>{selectedPlayer.userName}</b>
        <br />
        Số chân còn sống: <b>{maxLegs}</b>
      </div>

      <div className="space-y-4">
        <NumberInput
          label={`Số chân muốn hốt (Tối đa ${maxLegs})`}
          value={hotLegs}
          onChange={(val) => setHotForm({ ...hotForm, legs: val })}
          max={maxLegs}
          placeholder="Nhập số lượng"
          error={!isLegsValid ? `Vượt quá số chân cho phép (${maxLegs})` : ""}
        />

        <NumberInput
          label="Số tiền bỏ thăm (B)"
          value={bidAmount}
          onChange={(val) => setHotForm({ ...hotForm, bidAmount: val })}
          placeholder="Nhập số tiền (VNĐ)"
          suffix={<span className="text-gray-500 text-xs font-bold">VNĐ</span>}
        />

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase">
            Dự tính tiền về
          </h4>
          <div className="flex justify-between items-end">
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                Hốt: <b>{hotLegs}</b> chân
              </p>
              <p>
                Thảo: <b>-{computedValues.E.toLocaleString()}</b>/chân
              </p>
              <p>
                Bỏ thăm: <b>-{computedValues.B.toLocaleString()}</b>/chân
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Thực nhận</p>
              <p className="text-2xl font-bold text-green-600">
                {computedValues.receiveAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={closeModal}
          className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-none"
        >
          Hủy
        </Button>
        <Button
          onClick={processHot}
          disabled={isPending || !isLegsValid}
          className="flex-[2]"
        >
          {isPending ? "Đang xử lý..." : "Xác nhận hốt"}
        </Button>
      </div>
    </div>
  );
};

export default HotModal;

import React, { useState, useEffect } from "react";
import { Input, Modal, useSnackbar } from "zmp-ui";
import { TModelChildGroup } from "@/types";
import { useUpdateFundMutation } from "@/hooks/useFundQueries";
import { NumberInput } from "@/components/ui/NumberInput";

type Props = {
  visible: boolean;
  onClose: () => void;
  fund: TModelChildGroup | null;
};

const EditFundModal = ({ visible, onClose, fund }: Props) => {
  const [form, setForm] = useState({
    name: "",
    amount: 0,
    fee: 0,
  });
  const { openSnackbar } = useSnackbar();
  const { mutate: updateFund, isPending } = useUpdateFundMutation();

  // Load dữ liệu cũ
  useEffect(() => {
    if (fund && visible) {
      setForm({
        name: fund.name,
        amount: fund.amount,
        fee: fund.fee,
      });
    }
  }, [fund, visible]);

  const isStarted = fund?.members?.some((m: any) => m.legsClaimed > 0) || false;

  const handleSubmit = () => {
    if (!fund) return;
    if (!form.name || form.amount <= 0) {
      openSnackbar({
        text: "Vui lòng nhập đủ thông tin hợp lệ",
        type: "error",
      });
      return;
    }

    updateFund(
      {
        fundId: fund.id || fund._id || "",
        name: form.name,
        amount: form.amount,
        fee: form.fee,
      },
      {
        onSuccess: () => {
          openSnackbar({ text: "Cập nhật thành công!", type: "success" });
          onClose();
        },
        onError: (err: any) => {
          openSnackbar({ text: err.message, type: "error" });
        },
      }
    );
  };

  return (
    <Modal
      visible={visible}
      title="Chỉnh sửa dây hụi"
      onClose={onClose}
      actions={[
        {
          text: "Hủy",
          close: true,
          style: { color: "gray" },
        },
        {
          text: isPending ? "Đang lưu..." : "Lưu thay đổi",
          highLight: true,
          onClick: handleSubmit,
          disabled: isPending,
        },
      ]}
    >
      <div className="flex flex-col gap-4 py-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Tên dây hụi
          </label>
          <Input
            placeholder="Nhập tên dây hụi"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Số tiền hụi
            {isStarted && (
              <span className="text-red-500 text-xs ml-1">
                (Không thể sửa khi đã chạy)
              </span>
            )}
          </label>
          <NumberInput
            value={form.amount}
            onChange={(val) => setForm({ ...form, amount: val })}
            disabled={isStarted}
            className={isStarted ? "bg-gray-100 text-gray-500" : ""}
            placeholder="VNĐ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Tiền thảo / B
          </label>
          <NumberInput
            value={form.fee}
            onChange={(val) => setForm({ ...form, fee: val })}
            placeholder="VNĐ"
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditFundModal;

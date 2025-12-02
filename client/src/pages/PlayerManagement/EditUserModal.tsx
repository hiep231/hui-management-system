import React, { useState, useEffect } from "react";
import { Input, Modal, useSnackbar } from "zmp-ui";
import { TModelPlayer } from "@/types/player";
import { useUpdatePlayerMutation } from "@/hooks/usePlayerQueries";

type Props = {
  visible: boolean;
  onClose: () => void;
  player: TModelPlayer | null;
};

const EditUserModal = ({ visible, onClose, player }: Props) => {
  const [form, setForm] = useState({ userName: "" });
  const { openSnackbar } = useSnackbar();
  const { mutate: updatePlayer, isPending } = useUpdatePlayerMutation();

  useEffect(() => {
    if (player && visible) {
      setForm({
        userName: player.userName,
      });
    }
  }, [player, visible]);

  const handleSubmit = () => {
    if (!player) return;
    if (!form.userName) {
      openSnackbar({ text: "Vui lòng nhập đủ thông tin", type: "error" });
      return;
    }

    updatePlayer(
      { id: player.id, userName: form.userName },
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
      title="Chỉnh sửa thông tin"
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
      <div className="w-full space-y-2 mt-8">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Tên hiển thị
        </label>
        <Input
          placeholder="Nhập tên mới"
          value={form.userName}
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
        />
      </div>
    </Modal>
  );
};

export default EditUserModal;

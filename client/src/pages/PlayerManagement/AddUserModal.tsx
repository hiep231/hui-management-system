import React, { useState, useEffect } from "react";
import { Modal, useSnackbar } from "zmp-ui";
import { useCreatePlayerMutation } from "@/hooks/usePlayerQueries";
import { User, PenLine } from "lucide-react";
import { cn } from "@/utils";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const AddUserModal = ({ visible, onClose }: Props) => {
  const [name, setName] = useState("");
  const { openSnackbar } = useSnackbar();
  const { mutate: createPlayer, isPending } = useCreatePlayerMutation();

  useEffect(() => {
    if (!visible) setName("");
  }, [visible]);

  const handleSubmit = () => {
    if (!name.trim()) {
      openSnackbar({ text: "Vui lòng nhập tên người chơi", type: "error" });
      return;
    }

    createPlayer(
      { name: name.trim() },
      {
        onSuccess: () => {
          openSnackbar({ text: "Thêm thành công!", type: "success" });
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
      title="Thêm người chơi mới"
      onClose={onClose}
      actions={[
        {
          text: "Đóng",
          close: true,
          style: { color: "gray" },
        },
        {
          text: isPending ? "Đang lưu..." : "Thêm ngay",
          highLight: true,
          onClick: handleSubmit,
          disabled: isPending || !name.trim(),
        },
      ]}
    >
      <div className="w-full space-y-2 mt-8">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
          Tên hiển thị
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <PenLine
              size={18}
              className={cn(
                "transition-colors duration-300",
                name ? "text-primary" : "text-gray-400"
              )}
            />
          </div>
          <input
            type="text"
            autoFocus
            placeholder="Ví dụ: Dì Ba Bún Bò"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-base font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;

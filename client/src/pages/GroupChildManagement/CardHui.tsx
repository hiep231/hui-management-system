import { Edit, Trash2, ChevronRight, Banknote, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { TModelChildGroup, TModelParentGroups } from "@/types";
import { useState } from "react";
import EditFundModal from "./EditFundModal";
import { Modal, useSnackbar } from "zmp-ui";
import { useDeleteFundMutation } from "@/hooks/useFundQueries";
import { cn, formatCompactNumber } from "@/utils";

type TCardHuiProps = {
  childGroup: TModelChildGroup;
  parentGroup?: TModelParentGroups;
};

const CardHui = ({ childGroup, parentGroup }: TCardHuiProps) => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { mutate: deleteFund, isPending: isDeleting } = useDeleteFundMutation();

  const handleConfirmDelete = () => {
    deleteFund(childGroup.id || childGroup._id || "", {
      onSuccess: () => {
        openSnackbar({ text: "Đã xóa dây hụi", type: "success" });
        setIsDeleteOpen(false);
      },
      onError: (err: any) => openSnackbar({ text: err.message, type: "error" }),
    });
  };

  const goToDetail = () => {
    navigate("/group-detail", {
      state: {
        selectedGroup: childGroup,
        parentGroup: parentGroup,
      },
    });
  };

  // Tính toán trạng thái (Ví dụ: dựa trên số chân đã hốt)
  const activeLegs =
    childGroup.members?.filter((m) => m.legsClaimed > 0).length || 0;
  const totalLegs = childGroup.totalLegsRegistered || 12;
  const progress = Math.round((activeLegs / totalLegs) * 100);

  return (
    <>
      <div
        onClick={goToDetail}
        className="group bg-white rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden active:scale-[0.98] transition-all duration-200"
      >
        {/* Decorative Left Border */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>

        <div className="p-4 pl-5">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                {childGroup.name}
              </h3>

              <div className="flex items-baseline gap-1 text-gray-500 text-xs mb-3">
                <span>Đã đi được:</span>
                <span className="font-bold text-primary">
                  {activeLegs}/{totalLegs} kỳ ({progress}%)
                </span>
              </div>

              {/* Money Info Grid */}
              <div className="flex gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-medium">
                    Tiền hụi
                  </p>
                  <p className="text-base font-bold text-gray-800">
                    {formatCompactNumber(childGroup.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-medium">
                    Tiền thảo
                  </p>
                  <p className="text-base font-bold text-orange-600">
                    {formatCompactNumber(childGroup.fee)}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Icon */}
            <div className="flex flex-col items-end justify-between h-full min-h-[80px]">
              <ChevronRight
                className="text-gray-300 group-hover:text-primary transition-colors"
                size={20}
              />
            </div>
          </div>
        </div>

        {/* Actions Footer - Tách biệt để dễ bấm */}
        <div className="grid grid-cols-2 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border-r border-gray-100 active:bg-gray-200"
          >
            <Edit size={14} /> Chỉnh sửa
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors active:bg-gray-200"
          >
            <Trash2 size={14} /> Xóa dây
          </button>
        </div>
      </div>

      {/* --- Modals --- */}
      <EditFundModal
        visible={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        fund={childGroup}
      />

      <Modal
        visible={isDeleteOpen}
        title="Xác nhận xóa"
        onClose={() => setIsDeleteOpen(false)}
        actions={[
          { text: "Hủy", close: true, style: { color: "gray" } },
          {
            text: isDeleting ? "Đang xóa..." : "Xóa ngay",
            danger: true,
            onClick: handleConfirmDelete,
            disabled: isDeleting,
          },
        ]}
        description={`Bạn có chắc chắn muốn xóa dây hụi "${childGroup.name}"? Dữ liệu lịch sử đóng tiền của dây này cũng sẽ mất.`}
      />
    </>
  );
};

export default CardHui;

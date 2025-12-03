import { useNavigate } from "react-router";
import {
  Trash2,
  Users,
  Layers,
  Footprints,
  ChevronRight,
  Banknote,
} from "lucide-react";
import { useState } from "react";
import { Modal, useSnackbar } from "zmp-ui";
import { useDeleteManyFundsMutation } from "@/hooks/useFundQueries";
import { cn, formatCompactNumber } from "@/utils";

type TStats = {
  totalParticipants: number;
  totalLegs: number;
  totalChildGroups: number;
};

interface IProp {
  parentGroup: any;
  childGroups: any[];
  stats: TStats;
}

const CardHuiGroup = ({ parentGroup, childGroups, stats }: IProp) => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate: deleteMany, isPending } = useDeleteManyFundsMutation();

  const handleConfirmDelete = () => {
    const idsToDelete = childGroups.map((child) => child.id || child._id);
    if (idsToDelete.length === 0) return;

    deleteMany(idsToDelete, {
      onSuccess: () => {
        openSnackbar({
          text: `Đã xóa nhóm hụi "${parentGroup.name}"`,
          type: "success",
        });
        setIsDeleteModalOpen(false);
      },
      onError: (err: any) => {
        openSnackbar({ text: err.message, type: "error" });
      },
    });
  };

  const goToChildGroups = () => {
    navigate("/groups-child", {
      state: {
        childGroups: childGroups,
        parentGroup: parentGroup,
      },
    });
  };

  return (
    <>
      <div
        onClick={goToChildGroups}
        className="bg-white rounded-2xl shadow-sm border border-gray-500 relative overflow-hidden active:scale-[0.99] transition-all duration-200 group"
      >
        <div className="p-4 border-b border-gray-50 flex justify-between items-start bg-gradient-to-r from-gray-400 to-gray-100">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {parentGroup.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600 font-medium">
                T{new Date(parentGroup.createdDate).getMonth() + 1}/
                {new Date(parentGroup.createdDate).getFullYear()}
              </span>
              <span>
                • Tạo ngày {new Date(parentGroup.createdDate).getDate()}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-gray-600 rounded-full transition-colors -mr-2 -mt-2"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Tiền hụi
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCompactNumber(parentGroup.amount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Tiền thảo
              </p>
              <p className="text-lg font-semibold text-orange-600">
                {formatCompactNumber(parentGroup.thaoAmount)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 rounded-lg p-2 flex flex-col items-center justify-center border border-blue-100">
              <Layers size={16} className="text-blue-500 mb-1" />
              <span className="font-bold text-gray-800">
                {stats.totalChildGroups}
              </span>
              <span className="text-[10px] text-gray-500">Dây con</span>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 flex flex-col items-center justify-center border border-purple-100">
              <Users size={16} className="text-purple-500 mb-1" />
              <span className="font-bold text-gray-800">
                {stats.totalParticipants}
              </span>
              <span className="text-[10px] text-gray-500">Người chơi</span>
            </div>
            <div className="bg-emerald-50 rounded-lg p-2 flex flex-col items-center justify-center border border-emerald-100">
              <Footprints size={16} className="text-emerald-500 mb-1" />
              <span className="font-bold text-gray-800">{stats.totalLegs}</span>
              <span className="text-[10px] text-gray-500">Tổng chân</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-2 flex justify-center items-center border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500 flex items-center gap-1 group-hover:text-primary transition-colors">
            Xem chi tiết <ChevronRight size={14} />
          </span>
        </div>
      </div>

      <Modal
        visible={isDeleteModalOpen}
        title="Xóa nhóm hụi"
        onClose={() => setIsDeleteModalOpen(false)}
        actions={[
          { text: "Hủy", close: true, style: { color: "gray" } },
          {
            text: isPending ? "Đang xóa..." : "Xóa tất cả",
            danger: true,
            onClick: handleConfirmDelete,
            disabled: isPending,
          },
        ]}
      >
        <div className="p-4 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 className="text-red-600" size={24} />
          </div>
          <p className="text-gray-600">
            Bạn có chắc chắn muốn xóa nhóm <strong>{parentGroup.name}</strong>?
          </p>
          <p className="text-sm text-red-500 mt-2 font-medium">
            ⚠️ Hành động này sẽ xóa vĩnh viễn {childGroups.length} dây hụi con
            và toàn bộ lịch sử đóng tiền.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default CardHuiGroup;

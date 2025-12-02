import { TModelPlayer } from "@/types/player";
import { Phone, Edit, Trash2, ChevronRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditUserModal from "./EditUserModal";
import { Modal, useSnackbar } from "zmp-ui";
import { useDeletePlayerMutation } from "@/hooks/usePlayerQueries";
import { cn } from "@/utils";

type TProp = {
  player: TModelPlayer;
  playerGroups: any;
};

const CardUser = ({ player, playerGroups }: TProp) => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { mutate: deletePlayer, isPending: isDeleting } =
    useDeletePlayerMutation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-100 text-red-600",
      "bg-orange-100 text-orange-600",
      "bg-amber-100 text-amber-600",
      "bg-green-100 text-green-600",
      "bg-emerald-100 text-emerald-600",
      "bg-teal-100 text-teal-600",
      "bg-cyan-100 text-cyan-600",
      "bg-sky-100 text-sky-600",
      "bg-blue-100 text-blue-600",
      "bg-indigo-100 text-indigo-600",
      "bg-violet-100 text-violet-600",
      "bg-purple-100 text-purple-600",
      "bg-fuchsia-100 text-fuchsia-600",
      "bg-pink-100 text-pink-600",
      "bg-rose-100 text-rose-600",
    ];
    const charCode = name.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  const avatarColorClass = getAvatarColor(player.userName);

  const handleConfirmDelete = () => {
    deletePlayer(player.id, {
      onSuccess: () => {
        openSnackbar({ text: "Đã xóa người chơi", type: "success" });
        setIsDeleteModalOpen(false);
      },
      onError: () => openSnackbar({ text: "Lỗi khi xóa", type: "error" }),
    });
  };

  return (
    <>
      <div
        onClick={() =>
          navigate("/player-detail", { state: { selectedPlayer: player } })
        }
        className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-4 relative active:scale-[0.99] transition-all duration-200 overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-inner",
                avatarColorClass
              )}
            >
              {player.userName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                {player.userName}
              </h3>
              <p className="text-xs text-blue-600 mt-1 font-medium">
                Tham gia {playerGroups.length} dây hụi
              </p>
            </div>
          </div>

          <ChevronRight
            className="text-gray-300 group-hover:text-primary transition-colors"
            size={20}
          />
        </div>

        {/* Swipe Actions / Buttons */}
        <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-xs font-bold"
          >
            <Edit size={14} /> Sửa
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteModalOpen(true);
            }}
            className="w-10 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <EditUserModal
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        player={player}
      />

      <Modal
        visible={isDeleteModalOpen}
        title="Xác nhận xóa"
        onClose={() => setIsDeleteModalOpen(false)}
        actions={[
          { text: "Hủy", close: true, style: { color: "gray" } },
          {
            text: isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn",
            danger: true,
            onClick: handleConfirmDelete,
            disabled: isDeleting,
          },
        ]}
        description={`Bạn có chắc muốn xóa người chơi "${player.userName}"?`}
      />
    </>
  );
};

export default CardUser;

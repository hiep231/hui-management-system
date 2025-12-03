import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowLeftCircleIcon, Edit, StopCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useCloseFundMutation, useFundDetail } from "@/hooks/useFundQueries";
import { PassDownProps } from "@/providers/PropsPass/provider";
import { TModelChildGroup, TModelParentGroups } from "@/types";
import { useState } from "react";
import OverviewInfomation from "./OverviewInfomation";
import VerticalCycleList from "./VerticalCycleList";
import EditFundModal from "../GroupChildManagement/EditFundModal";
import { Modal, useSnackbar } from "zmp-ui";

export type TPropsDownGroupDetail = {
  selectedGroup: TModelChildGroup;
  parentGroup: TModelParentGroups;
};

const FullGroupDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { selectedGroup: navGroup, parentGroup } =
    state as TPropsDownGroupDetail;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  const { openSnackbar } = useSnackbar();
  const { data: fullFundData, isLoading } = useFundDetail(navGroup?.id);
  const { mutate: closeFund, isPending: isClosing } = useCloseFundMutation();

  const handleConfirmClose = () => {
    if (!fullFundData) return;

    closeFund(fullFundData._id || fullFundData.id, {
      onSuccess: () => {
        openSnackbar({ text: "Đã kết thúc dây hụi", type: "success" });
        setIsCloseModalOpen(false);
        navigate("/groups");
      },
      onError: (err: any) => {
        openSnackbar({ text: err.message, type: "error" });
      },
    });
  };

  if (isLoading || !fullFundData) {
    return (
      <PageContainer className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-500 animate-pulse">
          Đang tải dữ liệu dây hụi...
        </div>
      </PageContainer>
    );
  }

  const isActive = fullFundData.status !== false;

  return (
    <PassDownProps
      value={
        { selectedGroup: fullFundData, parentGroup } as TPropsDownGroupDetail
      }
    >
      <div className="bg-gray-50 min-h-screen">
        <Header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/groups")}
                className="!p-0 w-10 h-10 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="size-6 text-gray-700" />
              </Button>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-800 leading-tight">
                  {fullFundData.name}
                </span>
                <span className="text-xs text-gray-500">Chi tiết dây hụi</span>
              </div>
            </div>

            <div className="flex gap-1">
              {isActive && (
                <button
                  onClick={() => setIsCloseModalOpen(true)}
                  className="p-2 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-full transition-colors"
                  title="Kết thúc dây hụi"
                >
                  <StopCircle className="size-5" />
                </button>
              )}

              <button
                onClick={() => setIsEditOpen(true)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <Edit className="size-5" />
              </button>
            </div>
          </div>
        </Header>

        <PageContainer className="p-4 space-y-5 pb-24">
          <OverviewInfomation />
          <VerticalCycleList group={fullFundData} />
        </PageContainer>

        <EditFundModal
          visible={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          fund={fullFundData}
        />

        <Modal
          visible={isCloseModalOpen}
          title="Kết thúc dây hụi"
          onClose={() => setIsCloseModalOpen(false)}
          actions={[
            {
              text: "Hủy",
              close: true,
              style: { color: "gray" },
            },
            {
              text: isClosing ? "Đang xử lý..." : "Xác nhận",
              danger: true,
              onClick: handleConfirmClose,
              disabled: isClosing,
            },
          ]}
          description="Bạn có chắc chắn muốn kết thúc dây hụi này sớm? Dây hụi sẽ được chuyển vào mục Lịch sử."
        />
      </div>
    </PassDownProps>
  );
};

export default FullGroupDetail;

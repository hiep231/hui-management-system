import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { useLocation, useNavigate } from "react-router";
import CardHui from "./CardHui";
import { TModelChildGroup, TModelParentGroups } from "@/types";
import { ArrowLeft, Wallet, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { dayjsVN } from "@/utils/dayjsVN";

type TLocationState = {
  parentGroup?: TModelParentGroups;
  childGroups?: TModelChildGroup[];
};

const GroupChildManagement = () => {
  const navigate = useNavigate();
  const { childGroups = [], parentGroup } =
    (useLocation().state as TLocationState) || {};

  if (!parentGroup) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <p className="text-gray-500 mb-4">Không tìm thấy thông tin nhóm.</p>
        <Button onClick={() => navigate("/groups")}>Quay lại danh sách</Button>
      </div>
    );
  }

  const totalValue = childGroups.reduce(
    (sum, child) => sum + child.amount * 12,
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header className="bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="!p-0 w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="size-6 text-gray-700" />
          </Button>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 line-clamp-1">
              {parentGroup.name}
            </span>
            <span className="text-xs text-gray-500">Quản lý dây hụi con</span>
          </div>
        </div>
      </Header>

      <PageContainer className="flex-1 pb-24 pt-4">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 opacity-90 mb-1">
              <Wallet size={16} />
              <span className="text-sm font-medium">Ước tính tổng giá trị</span>
            </div>
            <p className="text-3xl font-bold mb-4">
              {(totalValue / 1000000).toLocaleString()}{" "}
              <span className="text-lg font-normal">Triệu</span>
            </p>

            <div className="flex gap-4 border-t border-white/20 pt-3">
              <div>
                <p className="text-xs opacity-70">Ngày tạo</p>
                <p className="font-medium text-sm">
                  {dayjsVN(parentGroup.createdDate).format("DD/MM/YYYY")}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-70">Số dây con</p>
                <p className="font-medium text-sm">{childGroups.length} dây</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-gray-800 font-bold text-base">
            Danh sách dây con
          </h3>
          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md">
            {childGroups.length}
          </span>
        </div>

        <div className="space-y-4">
          {childGroups.length > 0 ? (
            childGroups.map((childGroup) => (
              <CardHui
                key={childGroup.id}
                childGroup={childGroup}
                parentGroup={parentGroup}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 p-4 rounded-full mb-3">
                <FolderOpen className="w-10 h-10 text-gray-300" />
              </div>
              <p className="font-medium">Chưa có dây hụi con nào</p>
              <p className="text-xs mt-1 text-gray-400">
                Tạo dây hụi mới để bắt đầu
              </p>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default GroupChildManagement;

import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { usePlayerFunds } from "@/hooks/usePlayerQueries";
import { Button } from "@/components/ui/Button";
import { PassDownProps } from "@/providers/PropsPass/provider";
import { TModelChildGroup, TModelParentGroups } from "@/types";
import { TModelPlayer } from "@/types/player";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import { parentHuiGroupsAtom } from "@/modules/recoil-utils/utils.recoil";
import GroupDetail from "./components/GroupDetail";
import { cn } from "@/utils";

export type TPropsDownPlayerDetail = {
  selectedPlayer: TModelPlayer;
  activeChildGroup: TModelChildGroup;
  activeParentGroup: TModelParentGroups | undefined;
};

const PlayerDetail = () => {
  const parentGroups = useRecoilValue(parentHuiGroupsAtom);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { state } = useLocation();

  const selectedPlayer = state?.selectedPlayer as TModelPlayer | undefined;

  const { data: playerGroups = [], isLoading } = usePlayerFunds(
    selectedPlayer?.id || ""
  );

  if (!selectedPlayer) return null;

  const activeChildGroup: TModelChildGroup = playerGroups[activeTab];

  const activeParentGroup = parentGroups.find((p) => {
    if (!activeChildGroup) return false;
    const childDate = new Date(activeChildGroup.startDate || "");
    const parentDate = new Date(p.createdDate);
    return (
      p.amount === activeChildGroup.amount &&
      p.thaoAmount === activeChildGroup.fee &&
      childDate.getMonth() === parentDate.getMonth() &&
      childDate.getFullYear() === parentDate.getFullYear()
    );
  });

  const dropdownProps: TPropsDownPlayerDetail = {
    selectedPlayer,
    activeChildGroup,
    activeParentGroup,
  };

  return (
    <PassDownProps value={dropdownProps}>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header className="bg-white shadow-sm sticky top-0 z-50 !pb-0">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="!p-0 w-10 h-10 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="size-6 text-gray-700" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">
              {selectedPlayer.userName}
            </h1>
          </div>

          {isLoading ? (
            <div className="flex gap-2 pb-3 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-9 w-24 bg-gray-100 rounded-full animate-pulse"
                />
              ))}
            </div>
          ) : playerGroups.length > 0 ? (
            <div className="flex overflow-x-auto no-scrollbar pb-0 gap-4">
              {playerGroups.map((group, index) => {
                const isActive = activeTab === index;
                return (
                  <button
                    key={group.id}
                    onClick={() => setActiveTab(index)}
                    className={cn(
                      "pb-3 px-1 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200",
                      isActive
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {group.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="pb-4 text-sm text-gray-500">
              Chưa tham gia dây hụi nào
            </div>
          )}
        </Header>

        <PageContainer className="flex-1 !p-0">
          {isLoading ? (
            <div className="p-10 text-center text-gray-400">
              Đang tải dữ liệu...
            </div>
          ) : activeChildGroup ? (
            <GroupDetail />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p>Trống</p>
            </div>
          )}
        </PageContainer>
      </div>
    </PassDownProps>
  );
};

export default PlayerDetail;

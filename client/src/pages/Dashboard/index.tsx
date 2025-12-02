import PageContainer from "@/components/layout/PageContainer";
import ListHui from "./components/ListHui";
import QuickAction from "./components/QuickAction";
import StatsOverview from "./components/StatsOverview";
import { Bell } from "lucide-react";
import { dayjsVN } from "@/utils/dayjsVN";

const Dashboard = () => {
  const today = dayjsVN().format("dddd, DD MMMM");

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white sticky top-0 z-50 px-4 pb-2 pt-[calc(var(--zaui-safe-area-inset-top)+10px)] shadow-sm flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {today}
          </p>
          <h1 className="text-xl font-bold text-gray-900">
            Xin chào, Chủ Hụi! 👋
          </h1>
        </div>
      </div>

      <PageContainer className="flex-1 pt-4 pb-20">
        <StatsOverview />
        <QuickAction />
        <ListHui />
      </PageContainer>
    </div>
  );
};

export default Dashboard;

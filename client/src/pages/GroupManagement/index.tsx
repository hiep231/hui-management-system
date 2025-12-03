import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { Plus, Search, Calendar, FilterX } from "lucide-react";
import { useNavigate } from "react-router";
import CardHuiGroup from "./CardHuiGroup";
import { useGroupedFunds } from "@/hooks/useFundQueries";
import { useMemo, useState } from "react";
import { Input } from "zmp-ui";
import { Button } from "@/components/ui/Button";

const GroupManagement = () => {
  const navigate = useNavigate();
  const { data: groupedFunds = [], isLoading, isError } = useGroupedFunds();

  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [filterAmount, setFilterAmount] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [
      { value: "", title: "Tất cả năm" },
      { value: (currentYear - 1).toString(), title: `Năm ${currentYear - 1}` },
      { value: currentYear.toString(), title: `Năm ${currentYear}` },
      { value: (currentYear + 1).toString(), title: `Năm ${currentYear + 1}` },
    ];
  }, []);

  const filteredGroups = useMemo(() => {
    return groupedFunds
      .map((group: any) => {
        const validChildren = group.funds.filter((fund: any) => {
          const isActive = fund.status !== false;
          if (activeTab === "active" && !isActive) return false;
          if (activeTab === "history" && isActive) return false;
          if (filterAmount && !fund.amount.toString().includes(filterAmount))
            return false;
          const fundYear = new Date(fund.startDate).getFullYear().toString();
          if (filterYear && fundYear !== filterYear) return false;
          return true;
        });
        return { ...group, funds: validChildren, count: validChildren.length };
      })
      .filter((group: any) => group.funds.length > 0);
  }, [groupedFunds, activeTab, filterAmount, filterYear]);

  const renderGroups = () => {
    return filteredGroups.map((group: any) => {
      const { amount, fee, startMonth, startYear } = group._id;
      const groupName = `Dây ${
        amount >= 1000000 ? amount / 1000000 + "Tr" : amount / 1000 + "k"
      }`;
      const parentGroup = {
        id: JSON.stringify(group._id),
        name: `Hụi ${(amount / 1000).toLocaleString()}k (Thảo ${(
          fee / 1000
        ).toLocaleString()}k)`,
        amount: amount,
        thaoAmount: fee,
        createdDate: group.startDate,
      };
      const childGroups = group.funds.map((fund: any) => ({
        ...fund,
        id: fund._id,
        parentId: parentGroup.id,
      }));
      const stats = {
        totalParticipants: group.funds.reduce(
          (sum: number, f: any) => sum + (f.members?.length || 0),
          0
        ),
        totalLegs: group.funds.reduce(
          (sum: number, f: any) => sum + (f.totalLegsRegistered || 0),
          0
        ),
        totalChildGroups: group.count,
      };
      return (
        <CardHuiGroup
          key={parentGroup.id}
          parentGroup={parentGroup}
          childGroups={childGroups}
          stats={stats}
        />
      );
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header className="bg-white border-b border-gray-200 !pb-0 !pr-0">
        <div className="flex flex-col gap-4 pb-5">
          <div className="flex items-center justify-between pr-16">
            <h1 className="text-xl font-bold text-gray-900">Quản lý dây hụi</h1>
            <Button
              onClick={() => navigate("/create-group")}
              variant="primary"
              className="!h-9 !px-3 !text-sm !rounded-lg flex items-center gap-1 shadow-sm bg-green-600"
            >
              <Plus size={16} />{" "}
              <span className="hidden sm:inline">Tạo mới</span>
            </Button>
          </div>

          {/* <div className="flex space-x-6 mt-2">
            <button
              onClick={() => setActiveTab("active")}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all relative ${
                activeTab === "active"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Đang hoạt động
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Đã đóng
            </button>
          </div> */}
        </div>
      </Header>

      <PageContainer className="flex-1 pt-4 pb-24">
        <div className="flex bg-gray-200 p-1 rounded-md mb-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "active"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Đang hoạt động
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "history"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Lịch sử
          </button>
        </div>

        <div className="flex gap-3 mb-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              placeholder="Lọc theo số tiền..."
              value={filterAmount}
              onChange={(e) => setFilterAmount(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-400 rounded-lg text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div className="w-[120px] relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Calendar size={14} />
            </div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full pl-7 pr-2 py-2 bg-gray-50 border border-gray-400 rounded-lg text-sm focus:outline-none focus:border-primary appearance-none bg-transparent"
            >
              {yearOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white h-40 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-10">
            Có lỗi xảy ra khi tải dữ liệu.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGroups.length > 0 ? (
              renderGroups()
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <FilterX size={32} className="opacity-40" />
                </div>
                <p>Không tìm thấy dây hụi nào phù hợp.</p>
                {(filterAmount || filterYear) && (
                  <button
                    onClick={() => {
                      setFilterAmount("");
                      setFilterYear("");
                    }}
                    className="mt-2 text-primary text-sm font-medium hover:underline"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </PageContainer>
    </div>
  );
};

export default GroupManagement;

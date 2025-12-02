import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { api } from "@/services/api";
import { useEffect, useMemo, useState } from "react";
import { Calendar as CalendarIcon, Filter, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TModelChildGroup, TModelParentGroups } from "@/types";
import SummaryWidget from "./components/SummaryWidget";
import TransactionItem from "./components/TransactionItem";
import { dayjsVN } from "@/utils/dayjsVN";
import { useSnackbar } from "zmp-ui";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const [viewMode, setViewMode] = useState<"day" | "month" | "year">("month");
  const [dateValue, setDateValue] = useState(dayjsVN().format("YYYY-MM-DD"));
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenditure: 0,
    transactions: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [dateValue, viewMode, selectedYear]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      let paramDate = dateValue;
      if (viewMode === "year") {
        paramDate = `${selectedYear}-01-01`;
      }

      const res = await api.getStats(paramDate, viewMode);
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const goToFundDetail = (tx: any) => {
    const fundId = tx.fundId || tx.fundInfo?.id;
    const fundName = tx.fundName || tx.fundInfo?.name || "Tên dây hụi";

    if (!fundId) {
      openSnackbar({
        text: "Dữ liệu giao dịch thiếu ID dây hụi. Không thể xem chi tiết.",
        type: "warning",
      });
      return;
    }

    const mockSelectedGroup = {
      id: fundId,
      name: fundName,
    } as TModelChildGroup;

    const mockParentGroup: TModelParentGroups = {
      id: "mock_parent_id",
      name: fundName,
      amount: tx.amount || 0,
      thaoAmount: 0,
      createdDate: tx.time,
      totalParticipants: 0,
      totalLegs: 0,
    };

    navigate("/group-detail", {
      state: { selectedGroup: mockSelectedGroup, parentGroup: mockParentGroup },
    });
  };

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) =>
      (current - 2 + i).toString()
    ).reverse();
  }, []);

  const groupedTransactions = useMemo(() => {
    if (!stats.transactions || !Array.isArray(stats.transactions)) return {};

    return stats.transactions.reduce((groups: any, tx: any) => {
      const date = dayjsVN(tx.time).format("DD/MM/YYYY");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(tx);
      return groups;
    }, {});
  }, [stats.transactions]);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    const dateA = dayjsVN(a).toDate();
    const dateB = dayjsVN(b).toDate();
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header className="bg-white border-b border-gray-200 !pb-0">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-xl font-bold text-gray-900">Sổ Thu Chi</h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-2">
          {(["day", "month", "year"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === mode
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {mode === "day"
                ? "Theo Ngày"
                : mode === "month"
                ? "Theo Tháng"
                : "Theo Năm"}
            </button>
          ))}
        </div>

        {/* Date Picker Bar */}
        <div className="flex items-center justify-between py-2 border-t border-dashed border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
            <CalendarIcon size={16} />
            <span>Thời gian:</span>
          </div>
          <div className="relative">
            {viewMode === "day" && (
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="bg-transparent font-bold text-gray-800 text-right outline-none"
              />
            )}
            {viewMode === "month" && (
              <input
                type="month"
                value={dateValue.substring(0, 7)}
                onChange={(e) => setDateValue(`${e.target.value}-01`)}
                className="bg-transparent font-bold text-gray-800 text-right outline-none"
              />
            )}
            {viewMode === "year" && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent font-bold text-gray-800 text-right outline-none appearance-none pr-4"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </Header>

      <PageContainer className="flex-1 pt-4 pb-24">
        <SummaryWidget
          revenue={stats.totalRevenue}
          expenditure={stats.totalExpenditure}
        />

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Chi tiết giao dịch
          </h3>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            {stats.transactions?.length || 0}
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !stats.transactions || stats.transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
            <Filter className="size-10 mb-2 opacity-20" />
            <p>Không có giao dịch nào.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date) => {
              const dateLabel =
                date === dayjsVN().format("DD/MM/YYYY")
                  ? "Hôm nay"
                  : date === dayjsVN().subtract(1, "day").format("DD/MM/YYYY")
                  ? "Hôm qua"
                  : date;

              return (
                <div key={date}>
                  <div className="sticky top-[120px] z-0 mb-2 flex items-center gap-2">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                      {dateLabel}
                    </span>
                    <div className="h-px bg-gray-300 flex-1"></div>
                  </div>
                  <div className="space-y-2">
                    {groupedTransactions[date].map((tx: any, index: number) => (
                      <TransactionItem
                        key={index}
                        transaction={tx}
                        onClick={() => goToFundDetail(tx)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageContainer>
    </div>
  );
};

export default TransactionHistory;

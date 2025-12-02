import { useGroupedFunds } from "@/hooks/useFundQueries";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Clock } from "lucide-react";
import { formatCompactNumber } from "@/utils";

const ListHui = () => {
  const { data: groupedFunds = [], isLoading } = useGroupedFunds();
  const navigate = useNavigate();

  if (isLoading)
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );

  if (groupedFunds.length === 0) return null;

  return (
    <div className="mb-24">
      <div className="flex justify-between items-end mb-3 px-1">
        <h3 className="text-lg font-bold text-gray-800">Hoạt động gần đây</h3>
        <span
          onClick={() => navigate("/groups")}
          className="text-sm text-primary font-medium cursor-pointer active:opacity-60"
        >
          Xem tất cả
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {groupedFunds.slice(0, 3).map((group: any) => {
          const { amount, fee, startMonth, startYear } = group._id;

          const totalFunds = group.count;

          return (
            <div
              key={JSON.stringify(group._id)}
              onClick={() => navigate("/groups")}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.99] transition-all relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>

              <div className="flex justify-between items-start pl-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded tracking-wide">
                      Tháng {startMonth}/{startYear}
                    </span>
                  </div>

                  <h4 className="text-lg font-extrabold text-gray-800">
                    Hụi {formatCompactNumber(amount)}
                  </h4>

                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block"></span>
                    Thảo: {formatCompactNumber(fee)}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold text-sm mb-2">
                    {totalFunds} dây
                  </div>
                  <ChevronRight className="text-gray-300 w-5 h-5" />
                </div>
              </div>

              {/* Footer nhỏ: Trạng thái (Giả lập) */}
              <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center pl-2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={12} /> Đang hoạt động
                </div>
                {/* Nếu có dữ liệu ngày khui, hiển thị ở đây */}
                <div className="text-xs font-medium text-primary">
                  Kỳ tiếp theo: 15/{new Date().getMonth() + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListHui;

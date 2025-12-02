import Title from "@/components/ui/Typography";
import { usePropsPassDown } from "@/providers/PropsPass/hook";
import { useMemo } from "react";
import { TPropsDownGroupDetail } from ".";

const SummaryInfoOfMonth = ({ selectedMonth }) => {
  const { selectedGroup } = usePropsPassDown<TPropsDownGroupDetail>();

  const cycleData = selectedGroup.cycles.find(
    (c) => c.cycleNumber === selectedMonth
  );

  const { totalRevenue, totalExpenditure } = useMemo(() => {
    if (!cycleData) return { totalRevenue: 0, totalExpenditure: 0 };

    const totalExpenditure = cycleData.claimerDetail?.amountReceived || 0;
    const totalRevenue = cycleData.payments.reduce((sum, payment) => {
      return sum + payment.amountDue;
    }, 0);

    return { totalRevenue, totalExpenditure };
  }, [cycleData]);

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
      <Title>Tổng kết tháng {selectedMonth}:</Title>

      <div className="grid grid-cols-1 gap-0.5 mt-1">
        <div>
          <span className="text-gray-600">Tổng tiền thu:</span>
          <span className="ml-2 font-semibold text-green-600">
            {totalRevenue.toLocaleString()}đ
          </span>
        </div>
        <div>
          <span className="text-gray-600">Tổng tiền chi:</span>
          <span className="ml-2 font-semibold text-red-600">
            {totalExpenditure.toLocaleString()}đ
          </span>
        </div>
        <div>
          <span className="text-gray-600">Lợi nhuận (thảo):</span>
          <span className="ml-2 font-semibold text-blue-600">
            {(totalRevenue - totalExpenditure).toLocaleString()}đ
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryInfoOfMonth;

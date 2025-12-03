import { formatCompactNumber } from "@/utils";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";

type Props = {
  revenue: number;
  expenditure: number;
};

const SummaryWidget = ({ revenue, expenditure }: Props) => {
  const balance = revenue - expenditure;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      <div className="mb-4 text-center border-b border-dashed border-gray-200 pb-4">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
          Dòng tiền thực tế
        </p>
        <div
          className={`text-3xl font-bold ${
            balance >= 0 ? "text-blue-600" : "text-red-500"
          }`}
        >
          {balance > 0 ? "+" : ""}
          {formatCompactNumber(balance)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <ArrowDownCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Tổng thu</p>
            <p className="font-bold text-green-700 text-sm">
              {formatCompactNumber(revenue)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <ArrowUpCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Tổng chi</p>
            <p className="font-bold text-red-700 text-sm">
              {formatCompactNumber(expenditure)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryWidget;

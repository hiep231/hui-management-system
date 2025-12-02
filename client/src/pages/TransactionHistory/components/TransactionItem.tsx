import { ChevronRight } from "lucide-react";
import { cn, formatCompactNumber } from "@/utils";

type Props = {
  transaction: any;
  onClick: () => void;
};

const TransactionItem = ({ transaction, onClick }: Props) => {
  const isIncome = transaction.type === "INCOME";
  const playerName = transaction.player?.userName || "Unknown";
  const fundName = transaction.fundInfo?.name || transaction.fundName;

  const initial = playerName.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between active:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0",
            isIncome ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}
        >
          {initial}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-gray-800 text-sm truncate">
            {playerName}
          </p>
          <p className="text-xs text-gray-500 truncate pr-2">
            {fundName} • Kỳ {transaction.cycleNumber}
          </p>
        </div>
      </div>

      <div className="text-right flex-shrink-0 flex items-center gap-2">
        <div>
          <p
            className={cn(
              "font-bold text-sm",
              isIncome ? "text-green-600" : "text-red-600"
            )}
          >
            {isIncome ? "+" : "-"}
            {formatCompactNumber(transaction.amount)}
          </p>
          <p className="text-[10px] text-gray-400 uppercase">
            {isIncome ? "Thu" : "Chi"}
          </p>
        </div>
        <ChevronRight size={16} className="text-gray-300" />
      </div>
    </div>
  );
};

export default TransactionItem;

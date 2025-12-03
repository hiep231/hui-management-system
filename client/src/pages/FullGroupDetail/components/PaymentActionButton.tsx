import { Check, Banknote, RotateCcw } from "lucide-react";

type Props = {
  isPaid: boolean;
  isUpdating: boolean;
  onPay: () => void;
  onUndo: () => void;
};

const PaymentActionButton = ({ isPaid, isUpdating, onPay, onUndo }: Props) => {
  if (isPaid) {
    return (
      <button
        onClick={onUndo}
        disabled={isUpdating}
        className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-full border border-green-200 active:scale-95 transition-all shadow-sm"
      >
        <Check size={16} strokeWidth={3} />
        <span className="font-bold text-sm">Xong</span>
        <RotateCcw size={12} className="ml-1 text-green-500 opacity-50" />
      </button>
    );
  }

  return (
    <button
      onClick={onPay}
      disabled={isUpdating}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-md shadow-blue-200 active:scale-95 transition-all hover:bg-blue-700"
    >
      <Banknote size={18} />
      <span className="font-bold text-sm">Thu tiền</span>
    </button>
  );
};

export default PaymentActionButton;

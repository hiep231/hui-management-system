import { Calendar, ChevronDown } from "lucide-react";

type Props = {
  cycle: any;
};

const FutureCycleCard = ({ cycle }: Props) => {
  return (
    <div className="group mb-3 bg-gray-50 hover:bg-white rounded-xl p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-500 border border-gray-200 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
            {cycle.cycleNumber}
          </div>

          <div>
            <p className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors">
              Kỳ thứ {cycle.cycleNumber}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Calendar size={12} /> Dự kiến (Chưa mở)
            </p>
          </div>
        </div>

        {/* Action Hint */}
        <div className="flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-blue-500 transition-colors">
          <span>Mở</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default FutureCycleCard;

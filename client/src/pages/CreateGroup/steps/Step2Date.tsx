import { CustomInput } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { dayjsVN } from "@/utils/dayjsVN";

type Props = {
  form: any;
  setForm: (val: any) => void;
};

const Step2Date = ({ form, setForm }: Props) => {
  const startDate = dayjsVN(form.startDate);
  const endDate = startDate.add(11, "month");

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <Card title="Thời gian khui hụi">
        <div className="bg-blue-50 p-4 rounded-xl mb-5 flex items-start gap-3 border border-blue-100">
          <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
            <Calendar size={24} />
          </div>
          <div>
            <h4 className="text-blue-900 font-bold text-sm mb-1">
              Lưu ý về lịch
            </h4>
            <p className="text-blue-700 text-xs leading-relaxed">
              Bạn chỉ cần chọn ngày mở dây. Hệ thống sẽ tự động tạo lịch cho 11
              kỳ tiếp theo (mỗi kỳ cách nhau 1 tháng).
            </p>
          </div>
        </div>

        <CustomInput
          label="Ngày bắt đầu (Kỳ 1)"
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
      </Card>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock size={18} className="text-primary" /> Lộ trình dự kiến
        </h3>

        <div className="flex items-center justify-between relative z-10">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Bắt đầu</p>
            <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg font-bold border border-green-200">
              {startDate.format("DD/MM/YYYY")}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-2">
            <span className="text-[10px] text-gray-400 font-medium mb-1">
              12 Kỳ
            </span>
            <div className="w-full h-[2px] bg-gray-200 relative">
              <div className="absolute right-0 -top-1.5 text-gray-300">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Kết thúc</p>
            <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg font-bold border border-orange-200">
              {endDate.format("DD/MM/YYYY")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Date;

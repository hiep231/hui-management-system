import { Card } from "@/components/ui/Card";
import { NumberInput } from "@/components/ui/NumberInput";
import { Input } from "zmp-ui";

type Props = {
  form: any;
  setForm: (val: any) => void;
};

const SUGGESTED_AMOUNTS = [500000, 1000000, 2000000, 3000000, 5000000];

const Step1Info = ({ form, setForm }: Props) => {
  const formatCompact = (num: number) => (num / 1000000).toString() + "Tr";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <Card title="Thông tin cơ bản">
        <Input
          label="Tên dây hụi"
          placeholder="Ví dụ: Hụi 2 triệu dì Ba..."
          value={form.name}
          onChange={(val) => setForm({ ...form, name: val })}
        />
      </Card>

      <Card title="Thiết lập tài chính">
        <div className="mb-4">
          <NumberInput
            label="Số tiền đóng mỗi kỳ"
            value={form.amount}
            onChange={(val) => setForm({ ...form, amount: val })}
            placeholder="Ví dụ: 2.000.000"
            suffix={
              <span className="text-green-600 font-bold text-xs">VNĐ</span>
            }
          />

          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-2 pb-1">
            {SUGGESTED_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setForm({ ...form, amount: amt })}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-all ${
                  form.amount === amt
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {amt < 1000000
                  ? (amt / 1000).toString() + "k"
                  : formatCompact(amt)}
              </button>
            ))}
          </div>
        </div>

        <NumberInput
          label="Tiền thảo / Giá mở"
          value={form.fee}
          onChange={(val) => setForm({ ...form, fee: val })}
          placeholder="Ví dụ: 100.000"
          suffix={<span className="text-gray-500 font-bold text-xs">VNĐ</span>}
        />
      </Card>
    </div>
  );
};

export default Step1Info;

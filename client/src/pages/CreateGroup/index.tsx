import React, { useState } from "react";
import Header from "@/components/layout/Header";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Wallet,
  Calendar,
  Users,
} from "lucide-react";
import { useSnackbar } from "zmp-ui";
import { useCreateFundMutation } from "@/hooks/useFundQueries";
import Step1Info from "./steps/Step1Info";
import Step2Date from "./steps/Step2Date";
import Step3Participants from "./steps/Step3Participants";
import { cn } from "@/utils";

const STEPS = [
  { id: 1, icon: Wallet, label: "Thông tin" },
  { id: 2, icon: Calendar, label: "Thời gian" },
  { id: 3, icon: Users, label: "Thành viên" },
];

const CreateGroup = () => {
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();
  const { mutateAsync: createFund, isPending } = useCreateFundMutation();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    amount: 2000000,
    fee: 200000,
    startDate: new Date().toISOString().split("T")[0],
  });
  const [participants, setParticipants] = useState<any[]>([]);

  const nextStep = () => {
    if (step === 1 && (!formData.name || formData.amount <= 0)) {
      openSnackbar({ text: "Vui lòng nhập tên và số tiền!", type: "warning" });
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    const totalLegs = participants.reduce((sum, p) => sum + p.legs, 0);
    if (totalLegs !== 12) {
      openSnackbar({
        text: `Chưa đủ 12 chân (Hiện tại: ${totalLegs})`,
        type: "error",
      });
      return;
    }

    try {
      await createFund({
        ...formData,
        totalCycles: 12,
        startDate: new Date(formData.startDate).toISOString(),
        players: participants.map((p) => ({
          playerId: p.playerId,
          legs: p.legs,
        })),
      });
      openSnackbar({ text: "Tạo thành công!", type: "success" });
      navigate("/groups");
    } catch (error: any) {
      openSnackbar({ text: error.message, type: "error" });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header className="bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="!p-0 w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="size-6 text-gray-700" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">Tạo Dây Hụi Mới</h1>
        </div>
      </Header>

      <div className="bg-white pt-2 pb-4 px-6 sticky top-[calc(var(--zaui-safe-area-inset-top)+60px+10px)] z-20 shadow-sm">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -z-0 -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-[2px] bg-primary -z-0 -translate-y-1/2 transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>

          {STEPS.map((s) => {
            const isActive = s.id <= step;
            const isCurrent = s.id === step;
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="relative z-10 flex flex-col items-center bg-white px-1"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isActive
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-gray-300 text-gray-400",
                    isCurrent && "ring-4 ring-green-100 scale-110"
                  )}
                >
                  <Icon size={18} />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold mt-1 transition-colors",
                    isActive ? "text-primary" : "text-gray-400"
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <PageContainer className="flex-1 pt-4">
        {step === 1 && <Step1Info form={formData} setForm={setFormData} />}
        {step === 2 && <Step2Date form={formData} setForm={setFormData} />}
        {step === 3 && (
          <Step3Participants
            participants={participants}
            setParticipants={setParticipants}
          />
        )}
      </PageContainer>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-safe z-50 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={prevStep}
            className="flex-1 border-gray-300 text-gray-600"
          >
            Quay lại
          </Button>
        )}

        {step < 3 ? (
          <Button variant="primary" onClick={nextStep} className="flex-1">
            Tiếp theo <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isPending}
            className={cn(
              "flex-1",
              isPending ? "opacity-70" : "bg-green-600 hover:bg-green-700"
            )}
          >
            {isPending ? "Đang tạo..." : "Hoàn tất"}{" "}
            <Check className="ml-2 w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;

import React from "react";
import { Input } from "zmp-ui";
import { cn } from "@/utils";

const readMoney = (value: number | string) => {
  const num = Number(value);
  if (!num || isNaN(num)) return "";
  if (num >= 1000000000)
    return (num / 1000000000).toLocaleString("vi-VN") + " tỷ đồng";
  if (num >= 1000000)
    return (num / 1000000).toLocaleString("vi-VN") + " triệu đồng";
  if (num >= 1000) return (num / 1000).toLocaleString("vi-VN") + " nghìn đồng";
  return num.toLocaleString("vi-VN") + " đồng";
};

interface CustomInputProps {
  label?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number" | "password" | "date" | "tel";
  placeholder?: string;
  className?: string;
  suffix?: React.ReactNode;
  error?: string;
}

export const CustomInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className,
  suffix,
  error,
  ...props
}: CustomInputProps) => {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-gray-700 font-bold text-base mb-2 ml-1">
          {label}
        </label>
      )}

      <div className="relative">
        <Input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(error && "!border-danger !bg-red-50", className)}
          {...props}
        />

        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </div>
        )}
      </div>

      {type === "number" && value ? (
        <div className="mt-2 ml-1 text-primary font-semibold text-sm flex items-center gap-1 bg-primary-bg p-2 rounded-lg border border-primary/20">
          💡 Bằng chữ: {readMoney(value)}
        </div>
      ) : null}

      {error && (
        <p className="mt-1 ml-1 text-danger text-sm font-bold flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

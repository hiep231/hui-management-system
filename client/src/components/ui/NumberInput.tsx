import React, { useEffect, useState } from "react";
import { Input } from "zmp-ui";
import { cn } from "@/utils";

interface NumberInputProps {
  label?: string;
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  className?: string;
  suffix?: React.ReactNode;
  error?: string;
  max?: number;
  disabled?: boolean;
}

export const NumberInput = ({
  label,
  value,
  onChange,
  placeholder,
  className,
  suffix,
  error,
  max,
  disabled,
}: NumberInputProps) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value === 0 && displayValue === "") return;
    if (value !== parseNumber(displayValue)) {
      setDisplayValue(formatNumber(value));
    }
  }, [value]);

  const formatNumber = (num: number) => {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (str: string) => {
    return Number(str.replace(/\./g, ""));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;

    const cleanInput = rawInput.replace(/[^0-9]/g, "");

    const numValue = cleanInput ? parseInt(cleanInput, 10) : 0;

    if (max !== undefined && numValue > max) {
      return;
    }

    setDisplayValue(formatNumber(numValue));
    onChange(numValue);
  };

  return (
    <div className="mb-5">
      {label && (
        <label className="block text-gray-700 font-bold text-base mb-2 ml-1">
          {label}
        </label>
      )}

      <div className="relative">
        <Input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(error && "!border-danger !bg-red-50", className)}
        />

        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </div>
        )}
      </div>

      {value > 0 && (
        <div className="mt-2 ml-1 text-primary font-semibold text-xs flex items-center gap-1 bg-primary-bg p-1.5 rounded border border-primary/20">
          Bằng chữ: {docSoTien(value)}
        </div>
      )}

      {error && (
        <p className="mt-1 ml-1 text-danger text-sm font-bold flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

const docSoTien = (n: number) => {
  if (n >= 1000000000) return (n / 1000000000).toLocaleString("vi-VN") + " tỷ";
  if (n >= 1000000) return (n / 1000000).toLocaleString("vi-VN") + " triệu";
  if (n >= 1000) return (n / 1000).toLocaleString("vi-VN") + " nghìn";
  return n + " đồng";
};

import { cn } from "@/utils";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
}

export const Card = ({ children, className, onClick, title }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white",
        "rounded-2xl",
        "border-2 border-gray-100",
        "shadow-card",
        "p-5",
        "mb-4",
        onClick && "active:scale-[0.99] transition-transform cursor-pointer",
        className
      )}
    >
      {title && (
        <div className="mb-3 border-b-2 border-gray-100 pb-2">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

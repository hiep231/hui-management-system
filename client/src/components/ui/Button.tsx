import { cn } from "@/utils";
import React from "react";
import Ripple from "react-ripplejs";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  classNameChildren?: string;
}

export const Button = ({
  children,
  onClick,
  disabled,
  className,
  classNameChildren,
  style,
  variant = "primary",
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick && onClick(event);
  };

  const variants = {
    primary:
      "bg-primary text-white shadow-lg shadow-primary/30 active:bg-primary-dark",
    secondary:
      "bg-white text-primary border-2 border-primary hover:bg-primary-bg",
    danger: "bg-danger text-white shadow-lg shadow-danger/30 active:bg-red-700",
    outline:
      "bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "relative overflow-hidden transition-all active:scale-[0.98]",
        "h-14 px-6 rounded-2xl",
        "font-bold text-base tracking-wide",
        "flex items-center justify-center",
        variants[variant],
        disabled &&
          "bg-gray-300 text-gray-500 border-none shadow-none cursor-not-allowed active:scale-100",
        fullWidth ? "w-full" : "w-auto",
        className
      )}
      style={style}
      {...props}
    >
      <Ripple
        className={cn(
          "flex items-center justify-center gap-2 w-full h-full",
          classNameChildren
        )}
      >
        {children}
      </Ripple>
    </button>
  );
};

export const PrimaryButton = (props) => {
  const { onClick, disabled, className, style, children } = props;

  const handleClick = (event) => {
    if (!disabled) {
      onClick && onClick(event);
    }
  };

  return (
    <Ripple
      onClick={handleClick}
      className={`rounded-lg bg-primary text-white w-full text-center py-2 ${
        className || ""
      } ${disabled ? "!bg-primary/50" : ""}`}
      style={style}
    >
      {children}
    </Ripple>
  );
};

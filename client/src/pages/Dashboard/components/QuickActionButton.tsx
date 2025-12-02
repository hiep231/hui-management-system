import React from "react";

const COLOR_VARIANTS = {
  blue: "bg-blue-500 hover:bg-blue-600",
  green: "bg-green-500 hover:bg-green-600",
  orange: "bg-orange-500 hover:bg-orange-600",
  purple: "bg-purple-500 hover:bg-purple-600",
};

type QuickActionButtonProps = {
  color: keyof typeof COLOR_VARIANTS;
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
};

const QuickActionButton = ({
  color,
  icon,
  text,
  onClick,
}: QuickActionButtonProps) => {
  const colorClass = COLOR_VARIANTS[color] || COLOR_VARIANTS.blue;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white transition-all shadow-sm hover:shadow-md ${colorClass}`}
    >
      {icon}
      <span className="font-medium">{text}</span>
    </button>
  );
};

export default QuickActionButton;

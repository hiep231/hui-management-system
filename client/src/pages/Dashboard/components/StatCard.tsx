import React from "react";

type TStatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
};

const StatCard = ({ title, value, icon, gradient }: TStatCardProps) => (
  <div
    className={`bg-gradient-to-r ${gradient} text-white p-6 rounded-xl shadow-md flex justify-between items-center`}
  >
    <div>
      <p className="text-blue-100 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
    <div>{icon}</div>
  </div>
);
export default StatCard;

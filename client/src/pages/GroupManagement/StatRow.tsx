interface StatRowProps {
  label: string;
  value: string | number;
  suffix?: string;
}

const StatRow = ({ label, value, suffix }: StatRowProps) => {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>
      <span className="ml-2 font-semibold">
        {value}
        {suffix && ` ${suffix}`}
      </span>
    </div>
  );
};

export default StatRow;

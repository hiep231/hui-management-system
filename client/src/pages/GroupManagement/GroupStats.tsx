import StatRow from "./StatRow";

type TStats = {
  totalParticipants: number;
  totalLegs: number;
  totalChildGroups: number;
};

interface GroupStatsProps {
  amount: number;
  stats: TStats;
}

const GroupStats = ({ amount, stats }: GroupStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-1.5 mt-3">
      <StatRow label="Tiền hụi" value={amount.toLocaleString()} suffix="đ" />
      <StatRow
        label="Số lượng dây con"
        value={stats.totalChildGroups}
        suffix="dây"
      />
      <StatRow
        label="Tổng người"
        value={stats.totalParticipants}
        suffix="người"
      />
      <StatRow label="Tổng chân" value={stats.totalLegs} suffix="chân" />
    </div>
  );
};

export default GroupStats;

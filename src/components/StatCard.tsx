interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  tone?: 'safe' | 'caution' | 'danger';
}

export function StatCard({ label, value, delta, tone = 'safe' }: StatCardProps) {
  const toneClass = {
    safe: 'bg-green-50 text-green-700 border-green-200',
    caution: 'bg-orange-50 text-orange-700 border-orange-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
  }[tone];

  return (
    <div className="card-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <div className="flex items-center gap-3 mt-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {delta && <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${toneClass}`}>{delta}</span>}
      </div>
    </div>
  );
}

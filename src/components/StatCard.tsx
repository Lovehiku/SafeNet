interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  tone?: 'safe' | 'caution' | 'danger';
}

export function StatCard({ label, value, delta, tone = 'safe' }: StatCardProps) {
  const toneClass = {
    safe: 'bg-safe/15 text-safe border-safe/30',
    caution: 'bg-caution/15 text-caution border-caution/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
  }[tone];

  return (
    <div className="card-surface p-4 border border-white/10">
      <p className="text-sm text-muted">{label}</p>
      <div className="flex items-center gap-3 mt-2">
        <p className="text-2xl font-bold text-white">{value}</p>
        {delta && <span className={`text-xs font-semibold px-2 py-1 rounded-full ${toneClass}`}>{delta}</span>}
      </div>
    </div>
  );
}

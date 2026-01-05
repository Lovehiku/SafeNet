import { Severity } from '../types';

const severityStyles: Record<Severity, string> = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-orange-50 text-orange-700 border-orange-200',
  high: 'bg-red-50 text-red-700 border-red-200',
};

export function Badge({ label, severity }: { label: string; severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${severityStyles[severity]}`}
    >
      <span className="w-2 h-2 rounded-full bg-current" />
      {label}
    </span>
  );
}

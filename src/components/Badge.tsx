import { Severity } from '../types';

const severityStyles: Record<Severity, string> = {
  low: 'bg-safe/15 text-safe border-safe/40',
  medium: 'bg-caution/15 text-caution border-caution/40',
  high: 'bg-danger/15 text-danger border-danger/40',
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

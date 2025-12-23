interface FilterBarProps {
  severity: string;
  type: string;
  onSeverityChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function FilterBar({ severity, type, onSeverityChange, onTypeChange }: FilterBarProps) {
  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSeverityChange(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(e.target.value);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="col-span-1">
        <label className="text-xs text-muted uppercase tracking-wide">Severity</label>
        <select
          value={severity}
          onChange={handleSeverityChange}
          className="w-full mt-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary-400 outline-none"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="col-span-1">
        <label className="text-xs text-muted uppercase tracking-wide">Type</label>
        <select
          value={type}
          onChange={handleTypeChange}
          className="w-full mt-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary-400 outline-none"
        >
          <option value="all">All</option>
          <option value="harassment">Harassment</option>
          <option value="impersonation">Impersonation</option>
          <option value="doxxing">Doxxing</option>
          <option value="nsfw">NSFW</option>
          <option value="hate">Hate</option>
          <option value="scam">Scam</option>
        </select>
      </div>
    </div>
  );
}

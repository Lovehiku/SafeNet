interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}

export function ToggleSwitch({ label, description, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex items-start justify-between gap-3 cursor-pointer">
      <div>
        <p className="font-semibold text-white">{label}</p>
        {description && <p className="text-sm text-muted mt-1 max-w-xl">{description}</p>}
      </div>
      <div
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          checked ? 'bg-primary-500' : 'bg-white/15'
        }`}
        onClick={onChange}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </div>
    </label>
  );
}

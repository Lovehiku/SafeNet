export function Loader({ label = 'Working...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-muted">
      <span className="h-3 w-3 animate-ping rounded-full bg-primary-400" />
      <span className="h-3 w-3 animate-ping rounded-full bg-primary-300 delay-75" />
      <span className="h-3 w-3 animate-ping rounded-full bg-primary-200 delay-150" />
      <span className="text-sm font-semibold text-white">{label}</span>
    </div>
  );
}

import { ChangeEvent, DragEvent } from 'react';

interface ScanBoxProps {
  title: string;
  description: string;
  accept?: string;
  onFile: (file: File) => void;
  cta?: string;
}

export function ScanBox({ title, description, onFile, accept, cta = 'Upload' }: ScanBoxProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className="card-surface p-6 text-center border border-dashed border-white/15 hover:border-primary-400/60 transition-colors"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <p className="text-sm font-semibold tracking-wide text-primary-100 uppercase">{title}</p>
      <p className="text-muted mt-2 mb-4 max-w-lg mx-auto">{description}</p>
      <label className="btn-primary inline-flex items-center gap-2 cursor-pointer">
        <input type="file" className="hidden" accept={accept} onChange={handleChange} />
        {cta}
      </label>
      <p className="text-xs text-muted mt-2">Drag & drop supported</p>
    </div>
  );
}

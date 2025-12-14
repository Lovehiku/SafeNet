import { useState } from 'react';
import { ResultCard } from '../components/ResultCard';
import { ScanBox } from '../components/ScanBox';
import { useAppStore } from '../store/useAppStore';
import { Loader } from '../components/Loader';

export function ScreenshotAnalyzerPage() {
  const { analysis, runImageScan, loading } = useAppStore();
  const [status, setStatus] = useState('Upload a screenshot to begin');

  const handleFile = async (file: File) => {
    setStatus(`Analyzing ${file.name}...`);
    await runImageScan(file);
    setStatus('Analysis complete.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase text-primary-200 font-semibold">AI Assistance</p>
        <h1 className="text-3xl font-bold text-white">Screenshot Analyzer</h1>
        <p className="text-muted">Upload or drop a screenshot. We simulate detection of TFGBV signals.</p>
      </div>

      <ScanBox
        title="Upload screenshot"
        description="Supported: PNG, JPG. Your file stays local."
        accept="image/png,image/jpeg"
        onFile={handleFile}
        cta="Upload & Analyze"
      />

      <div className="card-surface p-5 flex items-center gap-3 text-sm text-muted">
        {loading ? <Loader label={status} /> : <span>{status}</span>}
      </div>

      {analysis && <ResultCard result={analysis} />}
    </div>
  );
}

import { useAppStore } from '../store/useAppStore';
import { useState } from 'react';
import { Loader } from '../components/Loader';
import { alertsApi } from '../services/api';

export function FakeProfileDetectorPage() {
  const { fakeMatches, fakeProfileResult, runFakeProfileCheck, loading } = useAppStore();
  const [status, setStatus] = useState('Upload a profile photo to check.');

  const handleFile = async (file: File) => {
    setStatus(`Scanning ${file.name} for duplicates...`);
    await runFakeProfileCheck(file);
    setStatus('Scan complete.');
  };
  const riskLevelColors = {
    low: 'bg-safe/15 text-safe border-safe/30',
    medium: 'bg-caution/15 text-caution border-caution/30',
    high: 'bg-danger/15 text-danger border-danger/30',
  };


  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase text-primary-200 font-semibold">Identity Safety</p>
        <h1 className="text-3xl font-bold text-white">Fake Profile Detector</h1>
        <p className="text-muted">Find lookalike or cloned accounts quickly.</p>
      </div>

      <div className="card-surface p-6 border border-dashed border-white/15">
        <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          Upload profile photo
        </label>
        <p className="text-xs text-muted mt-2">Simulated detection; no files leave your browser.</p>
      </div>

      <div className="card-surface p-5 text-sm text-muted">
        {loading ? <Loader label={status} /> : <span>{status}</span>}
      </div>

      {fakeProfileResult && (
        <div className="card-surface p-5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted uppercase tracking-wide mb-1">Risk Level</p>
              <p className={`text-lg font-semibold px-3 py-1 rounded-lg inline-block ${riskLevelColors[fakeProfileResult.risk]}`}>
                {fakeProfileResult.risk.toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted uppercase tracking-wide mb-1">Confidence</p>
              <p className="text-lg font-semibold text-white">{fakeProfileResult.confidence}%</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted uppercase tracking-wide mb-2">Reason</p>
            <p className="text-white">{fakeProfileResult.reason}</p>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="btn-primary"
              onClick={async () => {
                setStatus('Creating alert...');
                await alertsApi.create({
                  title: 'Fake profile detected',
                  type: 'fake-profile',
                  severity: fakeProfileResult.risk,
                  message: `Risk level: ${fakeProfileResult.risk}. ${fakeProfileResult.reason}`,
                  metadata: {
                    risk: fakeProfileResult.risk,
                    riskLevel: fakeProfileResult.risk,
                    confidence: fakeProfileResult.confidence,
                    reason: fakeProfileResult.reason,
                    matches: fakeMatches,
                  },
                });
                setStatus('Alert reported. Check Alert Center.');
              }}
            >
              Report
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                // Show safety tips
                alert('Safety Tips:\n\n1. Use unique profile photos across platforms\n2. Enable two-factor authentication\n3. Regularly check for impersonation\n4. Report suspicious accounts immediately\n5. Keep your profile photos private or watermarked');
              }}
            >
              Learn safety tips
            </button>
          </div>
        </div>
         )}

         <div className="grid md:grid-cols-2 gap-4">
           {fakeMatches.map((match) => (
             <div key={match.id} className="card-surface p-4 border border-white/10">
               <div className="flex items-center justify-between mb-2">
                 <p className="text-white font-semibold">{match.platform}</p>
                 <span className="px-2 py-1 rounded-full text-xs bg-primary-500/20 text-primary-100">
                   {match.similarity}% match
                 </span>
               </div>
               <p className="text-sm text-muted">Handle: {match.handle}</p>
               <p className="text-sm text-muted mt-1">{match.note}</p>
               </div>
        ))}
        {!fakeMatches.length && fakeProfileResult && <p className="text-muted">No specific matches found, but risk assessment completed.</p>}
        {!fakeMatches.length && !fakeProfileResult && <p className="text-muted">No matches detected yet.</p>}
      </div>
    </div>
  );
}

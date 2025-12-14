import { AnalysisResult } from '../types';

const riskCopy: Record<AnalysisResult['riskLevel'], string> = {
  safe: 'Stable environment. Keep regular hygiene and continue monitoring.',
  caution: 'Some risks detected. Consider applying the suggested steps soon.',
  danger: 'High-risk signs found. Act immediately and document evidence.',
};

export function ResultCard({ result }: { result: AnalysisResult }) {
  const riskClass = {
    safe: 'bg-safe/15 text-safe border-safe/30',
    caution: 'bg-caution/15 text-caution border-caution/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
  }[result.riskLevel];

  return (
    <div className="card-surface p-5 border border-white/10">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className={`text-sm font-semibold ${riskClass}`.trim()}>
            Risk level: {result.riskLevel.toUpperCase()} ({result.confidence}% confidence)
          </p>
          <h4 className="text-xl font-semibold text-white mt-1">{riskCopy[result.riskLevel]}</h4>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${riskClass}`}>AI generated</div>
      </div>
      <p className="text-muted text-sm">{result.summary}</p>
      <div className="mt-4">
        <p className="text-sm font-semibold text-white mb-2">Categories</p>
        <div className="flex flex-wrap gap-2">
          {result.categories.map((cat) => (
            <span key={cat} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs capitalize">
              {cat}
            </span>
          ))}
        </div>
      </div>
      {result.categoryConfidence && result.categoryConfidence.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-white mb-2">Category confidence</p>
          <div className="flex flex-wrap gap-2">
            {result.categoryConfidence.map((cc) => (
              <span key={cc.category} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                {cc.category}: {cc.confidence}%
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4">
        <p className="text-sm font-semibold text-white mb-2">Suggested steps</p>
        <ul className="list-disc list-inside text-muted space-y-1 text-sm">
          {result.suggestions.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

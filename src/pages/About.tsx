export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-3xl font-bold text-white">About SafeNet</h1>
      <p className="text-muted">
        SafeNet is a demo application showcasing cyber-safety workflows and education. It provides tools to detect risks,
        manage alerts, and access awareness resources.
      </p>
      <div className="space-y-2 text-sm text-muted">
        <p>- Built with React, TypeScript, TailwindCSS, and React Router.</p>
        <p>- Features include Dashboard, Alert Center, Analyzer, Fake Profile, Settings, and Awareness.</p>
        <p>- Data is simulated for demonstration purposes.</p>
      </div>
    </div>
  );
}

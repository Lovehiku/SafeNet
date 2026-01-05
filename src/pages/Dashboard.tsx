import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { AlertItem } from '../components/AlertItem';
import { Loader } from '../components/Loader';
import { ResultCard } from '../components/ResultCard';

export function DashboardPage() {
  const { alerts, fetchAlerts, loading, runTextScan, analysis } = useAppStore();
  const [text, setText] = useState('');
  const [status, setStatus] = useState('Idle');

  useEffect(() => {
    if (!alerts.length) {
      fetchAlerts();
    }
  }, [alerts.length, fetchAlerts]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-primary-600 font-semibold">SafeNet overview</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Dashboard</h1>
          <p className="text-muted">Monitor risk, recent alerts, and take action quickly.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/alerts" className="btn-ghost">View alerts</Link>
          <Link to="/analyzer" className="btn-primary">Run quick scan</Link>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        {(() => {
          const today = new Date();
          const isSameDay = (d: string) => {
            const dt = new Date(d);
            return (
              dt.getFullYear() === today.getFullYear() &&
              dt.getMonth() === today.getMonth() &&
              dt.getDate() === today.getDate()
            );
          };
          const todayScans = alerts.filter((a) => isSameDay(a.date)).length;
          const highRisk = alerts.filter((a) => a.severity === 'high').length;
          const resolved = alerts.filter((a) => a.status === 'resolved').length;
          const stats = [
            { label: 'Today scans', value: String(todayScans), tone: 'safe' as const },
            { label: 'High-risk alerts', value: String(highRisk), tone: 'danger' as const },
            { label: 'Resolved incidents', value: String(resolved), tone: 'safe' as const },
          ];
          return stats.map((stat) => <StatCard key={stat.label} {...stat} />);
        })()}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card title="Recent alerts" subtitle="Stay ahead with triage priorities" actions={<Link to="/alerts" className="text-sm text-primary-600 hover:text-primary-700">See all</Link>}>
          {loading && <Loader label="Loading alerts" />}
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <AlertItem key={alert.id} alert={alert} onClick={() => {}} />
            ))}
            {!alerts.length && !loading && <p className="text-muted text-sm">No alerts yet. Stay safe!</p>}
          </div>
        </Card>

        <Card
          title="Risk summary"
          subtitle="AI-driven risk language for clarity"
          actions={<span className="text-xs text-muted">Updated 5m ago</span>}
        >
          <div className="space-y-3">
            {(() => {
              const high = alerts.filter((a) => a.severity === 'high').length;
              const medium = alerts.filter((a) => a.severity === 'medium').length;
              const low = alerts.filter((a) => a.severity === 'low').length;
              return (
                <>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200">
                    <div>
                      <p className="text-sm font-semibold text-red-700">High risk</p>
                      <p className="text-xs text-muted">Incidents need urgent action.</p>
                    </div>
                    <span className="text-red-600 font-bold text-xl">{high}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-200">
                    <div>
                      <p className="text-sm font-semibold text-orange-700">Caution</p>
                      <p className="text-xs text-muted">Ongoing review.</p>
                    </div>
                    <span className="text-orange-600 font-bold text-xl">{medium}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                    <div>
                      <p className="text-sm font-semibold text-green-700">Stable</p>
                      <p className="text-xs text-muted">Monitoring and filters active.</p>
                    </div>
                    <span className="text-green-600 font-bold text-xl">{low}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </Card>

        <Card title="Quick scan" subtitle="Check a suspicious message or link">
          <div className="space-y-3">
            <textarea
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none min-h-[120px] text-gray-900"
              placeholder="Paste text or a short transcript to scan."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="btn-primary w-full"
              onClick={async () => {
                if (!text.trim()) {
                  setStatus('Please add some text to scan.');
                  return;
                }
                setStatus('Analyzing...');
                await runTextScan(text);
                setStatus('Scan complete.');
              }}
            >
              Analyze
            </button>
            <p className="text-xs text-muted text-center">{status}</p>
          </div>
        </Card>
        {analysis && (
          <div className="lg:col-span-3">
            <ResultCard result={analysis} />
          </div>
        )}
      </div>
    </div>
  );
}


import { useEffect, useMemo, useState } from 'react';
import { AlertItem as AlertItemType } from '../types';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/Card';
import { AlertItem } from '../components/AlertItem';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { FilterBar } from '../components/FilterBar';
import { Loader } from '../components/Loader';

export function AlertCenterPage() {
  const { alerts, fetchAlerts, deleteAlert, loading } = useAppStore();
  const [openAlert, setOpenAlert] = useState<AlertItemType | null>(null);
  const [severity, setSeverity] = useState('all');
  const [type, setType] = useState('all');
  const [templateOpen, setTemplateOpen] = useState(false);

  useEffect(() => {
    if (!alerts.length) fetchAlerts();
  }, [alerts.length, fetchAlerts]);

  const handleExportCSV = async () => {
    try {
      const res = await fetch('/api/alerts/export-csv');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'alerts.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV export failed:', err);
    }
  };

  const handleDownloadBundle = async () => {
    try {
      const res = await fetch('/api/alerts/download-bundle');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'alerts_bundle.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Bundle download failed:', err);
    }
  };

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      const severityOk = severity === 'all' || a.severity === severity;
      const typeOk = type === 'all' || a.category === type;
      return severityOk && typeOk;
    });
  }, [alerts, severity, type]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-primary-200 font-semibold">Incidents</p>
          <h1 className="text-3xl font-bold text-white">Alert Center</h1>
          <p className="text-muted">Review, triage, and download reports quickly.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={handleExportCSV}>Export CSV</button>
          <button className="btn-primary" onClick={handleDownloadBundle}>Download bundle</button>
          
        </div>
      </div>

      <Card title="Filters" subtitle="Refine by severity and type">
        <FilterBar severity={severity} type={type} onSeverityChange={setSeverity} onTypeChange={setType} />
      </Card>

      {loading && <Loader label="Loading alerts" />}

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((alert) => (
          <AlertItem key={alert.id} alert={alert} onClick={() => setOpenAlert(alert)} />
        ))}
        {!filtered.length && !loading && <p className="text-muted">No alerts match these filters.</p>}
      </div>

      <Modal open={!!openAlert} onClose={() => setOpenAlert(null)} title={openAlert?.title ?? ''}>
        {openAlert && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge label={openAlert.severity.toUpperCase()} severity={openAlert.severity} />
              <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 capitalize">
                {openAlert.status}
              </span>
              <span className="text-xs text-muted">{new Date(openAlert.date).toLocaleString()}</span>
            </div>
            <p className="text-muted text-sm">{openAlert.summary}</p>
            <div>
              <p className="text-sm font-semibold text-white">Suggested action</p>
              <p className="text-muted text-sm">{openAlert.recommendedAction}</p>
            </div>
            {openAlert.evidence?.length ? (
              <div>
                <p className="text-sm font-semibold text-white">Evidence</p>
                <div className="flex gap-2 flex-wrap">
                  {openAlert.evidence.map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-3">
              <button
                className="btn-primary"
                onClick={() => {
                  if (!openAlert) return;
                  const blob = new Blob([JSON.stringify(openAlert, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `alert-${openAlert.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download report
              </button>
              <button
                className="btn-ghost"
                onClick={() => {
                  setTemplateOpen(true);
                }}
              >
                Takedown template
              </button>
              <button
                className="btn-ghost text-danger"
                onClick={async () => {
                  if (openAlert) {
                    await deleteAlert(openAlert.id);
                    setOpenAlert(null);
                  }
                }}
              >
                Delete alert
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={templateOpen} onClose={() => setTemplateOpen(false)} title="Takedown template">
        {openAlert && (
          <div className="space-y-3 text-sm text-muted">
            <p>Copy and send to the platform/provider:</p>
            <div className="bg-white/5 border border-white/10 p-3 rounded">
              <p>Subject: Content takedown request</p>
              <p>
                Alert Title: {openAlert.title} | Severity: {openAlert.severity}
              </p>
              <p>Details: {openAlert.summary}</p>
              <p>Source: {openAlert.source}</p>
            </div>
            <button
              className="btn-primary"
              onClick={async () => {
                const text = `Content takedown request\nTitle: ${openAlert.title}\nSeverity: ${openAlert.severity}\nDetails: ${openAlert.summary}\nSource: ${openAlert.source}`;
                try {
                  await navigator.clipboard.writeText(text);
                } catch {
                  // ignore clipboard errors
                }
              }}
            >
              Copy template
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

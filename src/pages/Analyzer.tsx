import { useState } from 'react';
import { ResultCard } from '../components/ResultCard';
import { ScanBox } from '../components/ScanBox';
import { Loader } from '../components/Loader';
import { Card } from '../components/Card';
import { useAppStore } from '../store/useAppStore';
import { alertsApi } from '../services/api';

type AnalyzerType = 'text' | 'screenshot' | 'fake-profile';

export function AnalyzerPage() {
  const { analysis, fakeMatches, fakeProfileResult, runTextScan, runImageScan, runFakeProfileCheck, loading } = useAppStore();
  const [activeTab, setActiveTab] = useState<AnalyzerType>('text');
  const [text, setText] = useState('');
  const [textStatus, setTextStatus] = useState('Enter text to analyze');
  const [screenshotStatus, setScreenshotStatus] = useState('Upload a screenshot to begin');
  const [fakeProfileStatus, setFakeProfileStatus] = useState('Upload a profile photo to check.');

  const handleTextAnalyze = async () => {
    if (!text.trim()) {
      setTextStatus('Please add some text to scan.');
      return;
    }
    setTextStatus('Analyzing...');
    await runTextScan(text);
    setTextStatus('Analysis complete.');
  };

  const handleScreenshotFile = async (file: File) => {
    setScreenshotStatus(`Analyzing ${file.name}...`);
    await runImageScan(file);
    setScreenshotStatus('Analysis complete.');
  };

  const handleFakeProfileFile = async (file: File) => {
    setFakeProfileStatus(`Scanning ${file.name} for duplicates...`);
    await runFakeProfileCheck(file);
    setFakeProfileStatus('Scan complete.');
  };

  const riskLevelColors = {
    low: 'bg-green-50 text-green-700 border border-green-200',
    medium: 'bg-orange-50 text-orange-700 border border-orange-200',
    high: 'bg-red-50 text-red-700 border border-red-200',
  };

  const tabs: { id: AnalyzerType; label: string; description: string }[] = [
    {
      id: 'text',
      label: 'Text',
      description: 'Analyze text messages, comments, or transcripts for harmful content',
    },
    {
      id: 'screenshot',
      label: 'Screenshot',
      description: 'Upload screenshots to extract and analyze text content',
    },
    {
      id: 'fake-profile',
      label: 'Fake Profile',
      description: 'Detect potential fake profiles or image reuse',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xs uppercase text-primary-600 font-semibold">Digital Safety Analysis</p>
          <h1 className="text-3xl font-bold text-gray-900">Analyzer</h1>
          <p className="text-muted">Choose an analysis type to detect harmful content and protect yourself online.</p>
        </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1 overflow-x-auto" aria-label="Analyzer tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-muted hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Text Analysis Tab */}
        {activeTab === 'text' && (
          <div className="space-y-6">
            <Card
              title="Analyze Text"
              subtitle="Paste text, messages, or transcripts to detect harmful language patterns including threats, grooming, and hate speech."
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted block mb-2">Text to analyze</label>
                  <textarea
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none min-h-[200px] text-gray-900"
                    placeholder="Paste text, messages, comments, or any content you want to analyze for harmful patterns..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <button className="btn-primary w-full" onClick={handleTextAnalyze} disabled={loading}>
                  {loading ? <Loader label="Analyzing text" /> : 'Analyze Text'}
                </button>
                <div className="card-surface p-4 flex items-center gap-3 text-sm text-muted">
                  {loading ? <Loader label={textStatus} /> : <span>{textStatus}</span>}
                </div>
              </div>
            </Card>

            {analysis && activeTab === 'text' && <ResultCard result={analysis} />}
          </div>
        )}

        {/* Screenshot Analysis Tab */}
        {activeTab === 'screenshot' && (
          <div className="space-y-6">
            <Card
              title="Analyze Screenshot"
              subtitle="Upload screenshots of conversations, messages, or images containing text. We'll extract and analyze the content for harmful patterns."
            >
              <ScanBox
                title="Upload screenshot"
                description="Supported formats: PNG, JPG. Your file stays secure and local."
                accept="image/png,image/jpeg"
                onFile={handleScreenshotFile}
                cta="Upload & Analyze Screenshot"
              />
              <div className="card-surface p-4 flex items-center gap-3 text-sm text-muted">
                {loading ? <Loader label={screenshotStatus} /> : <span>{screenshotStatus}</span>}
              </div>
            </Card>

            {analysis && activeTab === 'screenshot' && <ResultCard result={analysis} />}
          </div>
        )}

        {/* Fake Profile Analyzer Tab */}
        {activeTab === 'fake-profile' && (
          <div className="space-y-6">
            <Card
              title="Analyze Fake Profile"
              subtitle="Upload a profile picture to check for potential fake profiles or image reuse across different platforms and accounts."
            >
              <div className="space-y-4">
                <ScanBox
                  title="Upload profile photo"
                  description="Upload a profile image to detect potential impersonation or fake accounts."
                  accept="image/png,image/jpeg"
                  onFile={handleFakeProfileFile}
                  cta="Upload & Analyze Profile"
                />
                <div className="card-surface p-4 flex items-center gap-3 text-sm text-muted">
                  {loading ? <Loader label={fakeProfileStatus} /> : <span>{fakeProfileStatus}</span>}
                </div>
              </div>
            </Card>

            {fakeProfileResult && (
              <Card title="Analysis Results">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted uppercase tracking-wide mb-1">Risk Level</p>
                      <p className={`text-lg font-semibold px-3 py-1 rounded-lg inline-block ${riskLevelColors[fakeProfileResult.risk]}`}>
                        {fakeProfileResult.risk.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted uppercase tracking-wide mb-1">Confidence</p>
                      <p className="text-lg font-semibold text-gray-900">{fakeProfileResult.confidence}%</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted uppercase tracking-wide mb-2">Reason</p>
                    <p className="text-gray-900">{fakeProfileResult.reason}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      className="btn-primary"
                      onClick={async () => {
                        setFakeProfileStatus('Creating alert...');
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
                        setFakeProfileStatus('Alert reported. Check Alert Center.');
                      }}
                    >
                      Report
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => {
                        alert(
                          'Safety Tips:\n\n1. Use unique profile photos across platforms\n2. Enable two-factor authentication\n3. Regularly check for impersonation\n4. Report suspicious accounts immediately\n5. Keep your profile photos private or watermarked'
                        );
                      }}
                    >
                      Learn safety tips
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {fakeMatches.length > 0 && (
              <Card title="Potential Matches">
                <div className="grid md:grid-cols-2 gap-4">
                  {fakeMatches.map((match) => (
                    <div key={match.id} className="card-surface p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-900 font-semibold">{match.platform}</p>
                        <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700 border border-orange-200">
                          {match.similarity}% match
                        </span>
                      </div>
                      <p className="text-sm text-muted">Handle: {match.handle}</p>
                      <p className="text-sm text-muted mt-1">{match.note}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {fakeProfileResult && fakeMatches.length === 0 && (
              <div className="card-surface p-4">
                <p className="text-muted text-sm">No specific matches found, but risk assessment completed.</p>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}


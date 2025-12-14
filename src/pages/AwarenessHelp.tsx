import { useState } from 'react';
import { safetyTips } from '../data/tips';
import { Modal } from '../components/Modal';

export function AwarenessHelpPage() {
  const [showHelpline, setShowHelpline] = useState(false);
  const [showSafetyPlan, setShowSafetyPlan] = useState(false);

  const openLink = (link: string) => {
    let url = link;
    if (!/^https?:\/\//i.test(link)) {
      url = 'https://' + link; // ensure full URL
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCallHelpline = () => {
    setShowHelpline(true);
  };

  const handleSafetyPlan = () => {
    const plan = {
      contacts: ['Trusted Friend', 'Local Helpline +1-800-555-1234', 'Emergency Services: 911'],
      steps: ['Document evidence', 'Block abuser', 'Report to platform', 'Reach support'],
      resources: [
        'https://www.stopbullying.gov',
        'https://www.unwomen.org/en/what-we-do/ending-violence-against-women',
        'https://www.who.int/news-room/fact-sheets/detail/violence-against-women'
      ],
    };
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'safety-plan.json';
    a.click();
    URL.revokeObjectURL(url);
    setShowSafetyPlan(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase text-primary-200 font-semibold">Support</p>
        <h1 className="text-3xl font-bold text-white">Awareness & Help</h1>
        <p className="text-muted">Learn safe actions and reach nearby support quickly.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safetyTips.map((tip) => (
          <div key={tip.title} className="card-surface p-4 border border-white/10">
            <p className="text-xs font-semibold text-primary-200 uppercase">Safety tip</p>
            <h3 className="text-lg font-semibold text-white mt-1">{tip.title}</h3>
            <p className="text-sm text-muted mt-2">{tip.body}</p>
            <button
              onClick={() => openLink(tip.link)}
              className="text-sm text-primary-200 mt-3 inline-flex items-center gap-1 hover:text-primary-100 transition-colors"
            >
              Learn more →
            </button>
          </div>
        ))}
      </div>

      <div className="card-surface p-6">
        <p className="text-sm font-semibold text-white">Need urgent support?</p>
        <p className="text-muted text-sm">Reach your local digital safety helpline or trusted contact.</p>
        <div className="flex flex-wrap gap-2 mt-3 text-sm">
          <button className="btn-primary" onClick={handleCallHelpline}>
            Call helpline
          </button>
          <button className="btn-ghost" onClick={handleSafetyPlan}>
            Share safety plan
          </button>
        </div>
      </div>

      <Modal open={showHelpline} onClose={() => setShowHelpline(false)} title="Helpline Numbers">
        <div className="space-y-4">
          <p className="text-muted text-sm">Contact these helplines for immediate support:</p>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-white font-semibold">National Digital Safety Helpline</p>
              <a href="tel:+18005551234" className="text-primary-200 hover:text-primary-100">
                +1-800-555-1234
              </a>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-white font-semibold">Emergency Services</p>
              <a href="tel:911" className="text-primary-200 hover:text-primary-100">
                911
              </a>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-white font-semibold">Crisis Text Line</p>
              <a href="sms:741741" className="text-primary-200 hover:text-primary-100">
                Text: 741741
              </a>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={showSafetyPlan} onClose={() => setShowSafetyPlan(false)} title="Safety Plan Downloaded">
        <div className="space-y-4">
          <p className="text-muted text-sm">
            Your safety plan has been downloaded. Keep it in a safe place and share it with trusted contacts.
          </p>
          <p className="text-muted text-sm">
            The plan includes emergency contacts, steps to take, and helpful resources.
          </p>
        </div>
      </Modal>
    </div>
  );
}
import { useState } from 'react';
import { safetyTips } from '../data/tips';
import { Modal } from '../components/Modal';

type AwarenessTab = 
  | 'overview' 
  | 'cyberstalking' 
  | 'harassment' 
  | 'impersonation' 
  | 'doxing' 
  | 'image-based-abuse' 
  | 'prevention-safety'
  | 'legal-rights'
  | 'psychological-impact';

export function AwarenessHelpPage() {
  const [showHelpline, setShowHelpline] = useState(false);
  const [showSafetyPlan, setShowSafetyPlan] = useState(false);
  const [activeTab, setActiveTab] = useState<AwarenessTab>('overview');

  const openLink = (link: string) => {
    let url = link;
    if (!/^https?:\/\//i.test(link)) {
      url = 'https://' + link;
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

  const tabs: { id: AwarenessTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'cyberstalking', label: 'Cyberstalking' },
    { id: 'harassment', label: 'Harassment' },
    { id: 'impersonation', label: 'Impersonation' },
    { id: 'doxing', label: 'Doxing' },
    { id: 'image-based-abuse', label: 'Image-Based Abuse' },
    { id: 'prevention-safety', label: 'Prevention & Safety' },
    { id: 'legal-rights', label: 'Your Legal Rights' },
    { id: 'psychological-impact', label: 'Psychological Impact' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg">🛡️</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Understanding Online Gender-Based Violence</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card-surface p-4">
        <nav className="flex flex-wrap gap-2" aria-label="Awareness topics">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="card-surface p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
            <div className="space-y-4 text-sm text-muted">
              <p>
                Online gender-based violence (OGBV) refers to any act of violence committed, assisted, or aggravated by the use of information and communication technologies against a person because of their gender. This form of violence has become increasingly prevalent as digital spaces expand.
              </p>
              <p>
                OGBV can take many forms, including harassment, cyberstalking, impersonation, doxing, and image-based abuse. Understanding these different types is crucial for recognizing when you or someone you know may be experiencing online abuse.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold text-orange-800 mb-2">Key Facts:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Women and girls are disproportionately affected by online gender-based violence</li>
                  <li>OGBV can cause significant psychological, emotional, and sometimes physical harm</li>
                  <li>Early recognition and support can help prevent escalation</li>
                  <li>Legal protections exist in many countries, including Ethiopia</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Cyberstalking Tab */}
        {activeTab === 'cyberstalking' && (
          <div className="card-surface p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Cyberstalking</h2>
            <div className="space-y-4 text-muted">
              <p>
                Cyberstalking involves the use of digital technologies to repeatedly harass, threaten, or intimidate someone. It often includes monitoring someone's online activity, sending unwanted messages, and using technology to track or surveil a person.
              </p>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Common signs:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Repeated unwanted messages, emails, or social media contact</li>
                  <li>Monitoring or tracking your online activity</li>
                  <li>Threats made through digital channels</li>
                  <li>Attempts to gather information about you or your contacts</li>
                  <li>Creating fake accounts to contact you</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold text-red-800 mb-2">If you're being cyberstalked:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Document all communications and save screenshots</li>
                  <li>Block the person on all platforms</li>
                  <li>Report to platform administrators</li>
                  <li>Contact local authorities if threats are made</li>
                  <li>Reach out to support services for help</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Harassment Tab */}
        {activeTab === 'harassment' && (
          <div className="card-surface p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Harassment</h2>
            <div className="space-y-4 text-muted">
              <p>
                Online harassment includes offensive, threatening, or unwanted behavior directed at someone through digital platforms. This can range from single incidents to persistent campaigns designed to intimidate, humiliate, or harm.
              </p>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Types of online harassment:</p>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li><strong>Hate speech:</strong> Targeting someone based on their gender, race, religion, or other characteristics</li>
                  <li><strong>Threats:</strong> Direct or indirect threats of violence or harm</li>
                  <li><strong>Doxing:</strong> Publishing private information without consent</li>
                  <li><strong>Brigading:</strong> Coordinated attacks by multiple people</li>
                  <li><strong>Trolling:</strong> Deliberately provocative or offensive behavior</li>
                </ul>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold text-orange-800 mb-2">Protecting yourself:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Use privacy settings to limit who can contact you</li>
                  <li>Block and report harassers immediately</li>
                  <li>Don't engage with harassers - it often escalates the situation</li>
                  <li>Keep evidence of harassment for reporting</li>
                  <li>Reach out to support networks</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Impersonation Tab */}
        {activeTab === 'impersonation' && (
          <div className="card-surface p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Impersonation</h2>
            <div className="space-y-4 text-muted">
              <p>
                Impersonation occurs when someone creates fake accounts, profiles, or identities pretending to be you or someone you know. This can be used to damage your reputation, deceive others, or commit fraud.
              </p>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Warning signs:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Fake social media profiles using your name or photos</li>
                  <li>People reporting messages they received "from you" that you didn't send</li>
                  <li>Accounts that mimic your profile but with slight variations</li>
                  <li>Suspicious activity in your name on platforms you don't use</li>
                </ul>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold text-orange-800 mb-2">What to do:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Report fake accounts to platform administrators immediately</li>
                  <li>Notify your friends and followers about the impersonation</li>
                  <li>Verify your own accounts with official badges where possible</li>
                  <li>Use SafeNet's Fake Profile Detector to check for image reuse</li>
                  <li>Consider legal action if impersonation causes harm</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Doxing Tab */}
        {activeTab === 'doxing' && (
          <div className="card-surface p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Doxing</h2>
            <div className="space-y-4 text-muted">
              <p>
                Doxing (or doxxing) is the act of publicly sharing someone's private or personal information online without their consent. This can include addresses, phone numbers, workplace information, financial details, or other sensitive data.
              </p>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Information often targeted:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Home or work addresses</li>
                  <li>Phone numbers and email addresses</li>
                  <li>Family member information</li>
                  <li>Financial information</li>
                  <li>Private photos or documents</li>
                  <li>Personal identification numbers</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold text-red-800 mb-2">If you've been doxed:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Contact platform administrators to remove the information immediately</li>
                  <li>Document everything with screenshots</li>
                  <li>Report to law enforcement if you feel unsafe</li>
                  <li>Consider temporarily increasing your physical security</li>
                  <li>Seek legal advice about your rights</li>
                  <li>Notify your workplace if work information was shared</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Image-Based Abuse Tab */}
        {activeTab === 'image-based-abuse' && (
          <div className="card-surface p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Image-Based Abuse</h2>
            <div className="space-y-4 text-muted">
              <p>
                Image-based abuse involves sharing, threatening to share, or creating intimate or sexual images without consent. This includes "revenge porn," deepfakes, and other forms of non-consensual image sharing.
              </p>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Forms of image-based abuse:</p>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li><strong>Non-consensual sharing:</strong> Sharing intimate images without permission</li>
                  <li><strong>Deepfakes:</strong> AI-generated fake images or videos</li>
                  <li><strong>Upskirting:</strong> Taking photos under clothing without consent</li>
                  <li><strong>Threats:</strong> Threatening to share images as blackmail</li>
                  <li><strong>Fake accounts:</strong> Using someone's images to create fake profiles</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold text-red-800 mb-2">Important steps to take:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Report content to platform administrators immediately</li>
                  <li>Contact support organizations specializing in image-based abuse</li>
                  <li>Document all instances with screenshots</li>
                  <li>Report to law enforcement - this is illegal in many jurisdictions</li>
                  <li>Seek emotional support - this can be extremely distressing</li>
                  <li>Consider legal action against the perpetrator</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Prevention & Safety Tab */}
        {activeTab === 'prevention-safety' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safetyTips.map((tip) => (
                <div key={tip.title} className="card-surface p-4">
                  <p className="text-xs font-semibold text-primary-600 uppercase">Safety tip</p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">{tip.title}</h3>
                  <p className="text-sm text-muted mt-2">{tip.body}</p>
                  <button
                    onClick={() => openLink(tip.link)}
                    className="text-sm text-primary-600 mt-3 inline-flex items-center gap-1 hover:text-primary-700 transition-colors"
                  >
                    Learn more →
                  </button>
                </div>
              ))}
            </div>

            <div className="card-surface p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">General Safety Practices</h3>
              <ul className="space-y-2 text-sm text-muted list-disc list-inside">
                <li>Use strong, unique passwords for each account</li>
                <li>Enable two-factor authentication where available</li>
                <li>Review privacy settings regularly on all platforms</li>
                <li>Be cautious about what personal information you share online</li>
                <li>Think carefully before sharing photos or location information</li>
                <li>Keep software and apps updated for security patches</li>
                <li>Use SafeNet tools to analyze suspicious messages or profiles</li>
              </ul>
            </div>
          </div>
        )}

        {/* Legal Rights Tab */}
        {activeTab === 'legal-rights' && (
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚖️</span>
              <h2 className="text-2xl font-bold text-gray-900">Your Legal Rights in Ethiopia</h2>
            </div>
            <p className="text-muted">Understanding your legal protections and rights when facing online gender-based violence in Ethiopia.</p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚖️</span>
                <p className="text-sm font-semibold text-green-800">Constitutional Protections</p>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Right to dignity and personal security (Article 24, FDRE Constitution)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Right to privacy - protection from unwarranted searches and interference (Article 26)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Protection from cruel, inhuman, or degrading treatment (Article 18)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Right to equality and non-discrimination based on gender (Article 25)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Freedom from gender-based violence and harmful practices</span>
                </li>
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-orange-800 mb-2">Taking Legal Action:</p>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Document all incidents with screenshots and timestamps</li>
                <li>File a report with local police or cybercrime units</li>
                <li>Contact legal aid organizations for assistance</li>
                <li>Preserve all evidence for legal proceedings</li>
                <li>Seek support from organizations specializing in gender-based violence</li>
              </ul>
            </div>
          </div>
        )}

        {/* Psychological Impact Tab */}
        {activeTab === 'psychological-impact' && (
          <div className="card-surface p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Psychological Impact</h2>
            <div className="space-y-4 text-muted">
              <p>
                Experiencing online gender-based violence can have serious psychological and emotional effects. Understanding these impacts is important for recognizing when you or someone you know needs support.
              </p>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Common psychological effects:</p>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li><strong>Anxiety and fear:</strong> Constant worry about online interactions or future attacks</li>
                  <li><strong>Depression:</strong> Feelings of sadness, hopelessness, or loss of interest</li>
                  <li><strong>Post-traumatic stress:</strong> Flashbacks, nightmares, or hypervigilance</li>
                  <li><strong>Shame and guilt:</strong> Feeling responsible for the abuse (remember: it's never your fault)</li>
                  <li><strong>Social isolation:</strong> Withdrawing from online or offline social interactions</li>
                  <li><strong>Sleep disturbances:</strong> Difficulty sleeping or changes in sleep patterns</li>
                  <li><strong>Loss of self-esteem:</strong> Negative impacts on self-worth and confidence</li>
                </ul>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold text-orange-800 mb-2">Seeking Support:</p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Talk to trusted friends or family members</li>
                  <li>Contact mental health professionals or counselors</li>
                  <li>Join support groups for survivors of online abuse</li>
                  <li>Practice self-care and stress management techniques</li>
                  <li>Remember that healing takes time - be patient with yourself</li>
                  <li>Consider taking breaks from social media if needed</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold text-green-800 mb-2">Important Reminders:</p>
                <p className="text-sm text-gray-700">
                  Experiencing online abuse is never your fault. Your feelings are valid, and seeking help is a sign of strength, not weakness. Recovery is possible, and support is available.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Need Urgent Support Section - Always Visible */}
      <div className="card-surface p-6">
        <p className="text-sm font-semibold text-gray-900">Need urgent support?</p>
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
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-semibold">National Digital Safety Helpline</p>
              <a href="tel:+251 116 672 290" className="text-primary-600 hover:text-primary-700">
                +251-116-672-290
              </a>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-semibold">Emergency Services</p>
              <a href="tel:911" className="text-primary-600 hover:text-primary-700">
                6388
              </a>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 font-semibold">Crisis Text Line</p>
              <a href="sms:7711" className="text-primary-600 hover:text-primary-700">
                Text: 7711
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

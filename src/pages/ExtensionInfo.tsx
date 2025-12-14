import { useState } from 'react';
import { Modal } from '../components/Modal';
import { apiConfig } from '../services/config';

export function ExtensionInfoPage() {
  const [showPermissions, setShowPermissions] = useState(false);
  const [showInstallation, setShowInstallation] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`${apiConfig.baseURL}/extension/download`);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'safenet-shield-extension.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setShowInstallation(true);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download extension. Please try again or check the backend server.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase text-primary-200 font-semibold">Browser Shield</p>
        <h1 className="text-3xl font-bold text-white">SafeNet Shield Extension</h1>
        <p className="text-muted">Protect yourself from harmful content in real-time while browsing.</p>
      </div>

      <div className="card-surface p-6 space-y-3">
        <p className="text-sm text-muted">What it does</p>
        <ul className="list-disc list-inside text-sm text-muted space-y-1">
          <li>Scans comments and DMs for TFGBV patterns before you open them.</li>
          <li>Blurs NSFW media by default with one-click reveal.</li>
          <li>Raises instant alerts with suggested takedown actions.</li>
          <li>Syncs with dashboard settings (notifications, auto-reporting).</li>
        </ul>
        <div className="flex flex-wrap gap-2 mt-4">
          <button 
            className="btn-primary" 
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Downloading...' : 'Download extension'}
          </button>
          <button 
            className="btn-ghost" 
            onClick={() => setShowPermissions(true)}
          >
            View permissions
          </button>
        </div>
      </div>

      <div className="card-surface p-6">
        <p className="text-sm font-semibold text-white mb-2">Installation Instructions</p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2">
          <li>Download the extension using the button above</li>
          <li>Extract the ZIP file to a folder</li>
          <li>Open Chrome and go to <code className="bg-surface px-1 rounded">chrome://extensions/</code></li>
          <li>Enable "Developer mode" (toggle in top-right)</li>
          <li>Click "Load unpacked" and select the extracted folder</li>
          <li>Click the extension icon to login with your SafeNet account</li>
        </ol>
      </div>

      <div className="card-surface p-6">
        <p className="text-sm font-semibold text-white">Privacy first</p>
        <p className="text-muted text-sm">All analysis is performed through the SafeNet Guardian API. Your browsing data stays private and is only analyzed when harmful content is detected.</p>
      </div>

      {/* Permissions Modal */}
      <Modal 
        open={showPermissions} 
        onClose={() => setShowPermissions(false)} 
        title="Extension Permissions"
      >
        <div className="space-y-4 text-sm">
          <p className="text-muted">SafeNet Shield requires the following permissions:</p>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-white mb-1">Storage</p>
              <p className="text-muted">Stores your authentication token and preferences locally. No data is sent to third parties.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Active Tab</p>
              <p className="text-muted">Allows the extension to scan content on the current webpage for harmful text and images.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Scripting</p>
              <p className="text-muted">Injects content scripts to monitor and protect you from harmful content in real-time.</p>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">Host Permissions</p>
              <p className="text-muted">Required to communicate with the SafeNet Guardian API and analyze content on web pages.</p>
            </div>
          </div>
          <div className="pt-4 border-t border-surface">
            <p className="text-muted text-xs">
              <strong className="text-white">Security Note:</strong> The extension only requests minimal permissions necessary for its functionality. All API calls are authenticated and encrypted.
            </p>
          </div>
        </div>
      </Modal>

      {/* Installation Modal */}
      <Modal 
        open={showInstallation} 
        onClose={() => setShowInstallation(false)} 
        title="Installation Guide"
      >
        <div className="space-y-4 text-sm">
          <p className="text-muted">Follow these steps to install SafeNet Shield:</p>
          <ol className="list-decimal list-inside space-y-3 text-muted">
            <li>
              <strong className="text-white">Extract the ZIP file</strong>
              <p className="mt-1">Unzip the downloaded file to a location you can easily find (e.g., Desktop or Documents).</p>
            </li>
            <li>
              <strong className="text-white">Open Chrome Extensions</strong>
              <p className="mt-1">Navigate to <code className="bg-surface px-1 rounded">chrome://extensions/</code> in your Chrome browser.</p>
            </li>
            <li>
              <strong className="text-white">Enable Developer Mode</strong>
              <p className="mt-1">Toggle the "Developer mode" switch in the top-right corner of the extensions page.</p>
            </li>
            <li>
              <strong className="text-white">Load the Extension</strong>
              <p className="mt-1">Click "Load unpacked" and select the extracted extension folder (the one containing manifest.json).</p>
            </li>
            <li>
              <strong className="text-white">Login</strong>
              <p className="mt-1">Click the SafeNet Shield icon in your toolbar and login with your SafeNet Guardian account.</p>
            </li>
            <li>
              <strong className="text-white">Enable Protection</strong>
              <p className="mt-1">Make sure the "Protection Enabled" toggle is ON in the extension popup.</p>
            </li>
          </ol>
          <div className="pt-4 border-t border-surface">
            <p className="text-muted text-xs">
              <strong className="text-white">Note:</strong> Make sure your SafeNet Guardian backend API is running on <code className="bg-surface px-1 rounded">http://localhost:4000</code> for the extension to work properly.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import { useAppStore } from '../store/useAppStore';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { Card } from '../components/Card';

export function SettingsPage() {
  const { settings, toggleSetting } = useAppStore();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase text-primary-200 font-semibold">Preferences</p>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-muted">Control detection, automation, and notifications.</p>
      </div>

      <Card title="Detection controls" subtitle="Tune what SafeNet looks for">
        <div className="space-y-4">
          <ToggleSwitch
            label="Grooming detection"
            description="Highlight grooming language patterns in chat and comments."
            checked={settings.groomingDetection}
            onChange={() => toggleSetting('groomingDetection')}
          />
          <ToggleSwitch
            label="NSFW filter"
            description="Blur explicit imagery automatically in previews."
            checked={settings.nsfwFilter}
            onChange={() => toggleSetting('nsfwFilter')}
          />
        </div>
      </Card>

      <Card title="Automation" subtitle="Decide when SafeNet acts for you">
        <div className="space-y-4">
          <ToggleSwitch
            label="Auto-reporting"
            description="Draft reports for high-risk incidents and queue for your approval."
            checked={settings.autoReporting}
            onChange={() => toggleSetting('autoReporting')}
          />
          <ToggleSwitch
            label="Notifications"
            description="Get push/email notifications for new alerts and status changes."
            checked={settings.notifications}
            onChange={() => toggleSetting('notifications')}
          />
        </div>
      </Card>
    </div>
  );
}

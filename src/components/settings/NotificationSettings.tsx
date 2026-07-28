import React from 'react';
import { Bell, ShieldAlert, Calendar, Send, Check } from 'lucide-react';
import { useSettingsContext } from '../../providers/SettingsContext';

export const NotificationSettings: React.FC = () => {
  const { settings, updateSettings } = useSettingsContext();
  const notifs = settings.notifications;

  const handleMasterToggle = async () => {
    const nextState = !notifs.enabled;
    await updateSettings({
      notifications: {
        ...notifs,
        enabled: nextState,
      },
    });
  };

  const handleToggleOption = async (key: keyof typeof notifs) => {
    if (key === 'enabled') return;
    await updateSettings({
      notifications: {
        ...notifs,
        [key]: !notifs[key],
      },
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-400" />
            Notification & Alert Preferences
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure system alerts, schedule reminders, and post status notifications.
          </p>
        </div>

        {/* Master Switch */}
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs font-semibold text-slate-300">
            {notifs.enabled ? 'Notifications Active' : 'Notifications Off'}
          </span>
          <div
            onClick={handleMasterToggle}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              notifs.enabled ? 'bg-amber-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                notifs.enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </div>
        </label>
      </div>

      <div className={`space-y-3 transition-opacity duration-200 ${notifs.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        {/* Post Reminder */}
        <div
          onClick={() => handleToggleOption('postReminder')}
          className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Post Reminders</h4>
              <p className="text-xs text-slate-400">Alert when a post is pending manual approval or immediate publishing</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notifs.postReminder}
            onChange={() => {}}
            className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer h-4 w-4"
          />
        </div>

        {/* Schedule Reminder */}
        <div
          onClick={() => handleToggleOption('scheduleReminder')}
          className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Schedule Reminders</h4>
              <p className="text-xs text-slate-400">Notify 15 minutes before scheduled execution window</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notifs.scheduleReminder}
            onChange={() => {}}
            className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer h-4 w-4"
          />
        </div>

        {/* System Alerts */}
        <div
          onClick={() => handleToggleOption('systemAlerts')}
          className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">System & Storage Alerts</h4>
              <p className="text-xs text-slate-400">Notify when storage usage exceeds 80% quota or auto-cleanup completes</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notifs.systemAlerts}
            onChange={() => {}}
            className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 cursor-pointer h-4 w-4"
          />
        </div>
      </div>
    </div>
  );
};

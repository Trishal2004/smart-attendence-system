import Navbar from '../../components/Navbar';
import { Shield, Bell, Palette, Database, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AdminSettings() {
  const { dark, toggle } = useTheme();

  return (
    <div>
      <Navbar title="Settings" />
      <div className="p-6 max-w-3xl space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-surface-900 dark:text-white">Appearance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Dark Mode</p>
              <p className="text-xs text-surface-500">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={toggle}
              className={`relative w-11 h-6 rounded-full transition-colors ${dark ? 'bg-primary-600' : 'bg-surface-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${dark ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-surface-900 dark:text-white">Notifications</h3>
          </div>
          {['Email Alerts', 'Push Notifications', 'Weekly Digest'].map((item) => (
            <div key={item} className="flex items-center justify-between py-2">
              <p className="text-sm text-surface-700 dark:text-surface-300">{item}</p>
              <button className="relative w-11 h-6 rounded-full bg-primary-600">
                <div className="absolute top-0.5 left-[22px] w-5 h-5 bg-white rounded-full shadow" />
              </button>
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-surface-900 dark:text-white">Security</h3>
          </div>
          <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

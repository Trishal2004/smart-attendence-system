import Navbar from '../../components/Navbar';
import { useTheme } from '../../context/ThemeContext';
import { Palette, Lock } from 'lucide-react';

export default function StudentSettings() {
  const { dark, toggle } = useTheme();

  return (
    <div>
      <Navbar title="Settings" />
      <div className="p-6 max-w-3xl space-y-6">
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

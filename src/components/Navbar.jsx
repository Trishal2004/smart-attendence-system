import { Bell, Search, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockNotifications } from '../data/mockData';

export default function Navbar({ title }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="h-16 border-b border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="lg:hidden w-8" />
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Home button - navigate to landing page */}
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          title="Go to Home"
        >
          <Home className="w-5 h-5 text-surface-600 dark:text-surface-400" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-surface-100 dark:bg-surface-800 rounded-xl">
          <Search className="w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-40 text-surface-700 dark:text-surface-300 placeholder:text-surface-400"
          />
        </div>

        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <Bell className="w-5 h-5 text-surface-600 dark:text-surface-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-700">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {mockNotifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-700/50 border-b border-surface-100 dark:border-surface-700/50 last:border-0">
                      <p className="text-sm text-surface-700 dark:text-surface-300">{n.message}</p>
                      <p className="text-xs text-surface-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

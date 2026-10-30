import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, change, changeType, color = 'primary' }) {
  const colorMap = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-400 to-warning-500',
    danger: 'from-danger-400 to-danger-500',
  };

  const bgMap = {
    primary: 'bg-primary-500/10',
    success: 'bg-success-500/10',
    warning: 'bg-warning-400/10',
    danger: 'bg-danger-500/10',
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white dark:bg-surface-900 rounded-2xl p-5 border border-surface-200 dark:border-surface-800 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-surface-500 dark:text-surface-400 font-medium">{label}</p>
          <p className="text-2xl font-bold mt-1 text-surface-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-xs mt-2 font-medium ${changeType === 'up' ? 'text-success-500' : 'text-danger-500'}`}>
              {changeType === 'up' ? '↑' : '↓'} {change} from last week
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${bgMap[color]} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 bg-gradient-to-br ${colorMap[color]} bg-clip-text`} style={{ color: color === 'primary' ? '#6366f1' : color === 'success' ? '#22c55e' : color === 'warning' ? '#eab308' : '#ef4444' }} />
        </div>
      </div>
    </motion.div>
  );
}

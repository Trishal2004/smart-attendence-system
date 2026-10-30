import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, BookOpen, BarChart3, Settings, LogOut,
  GraduationCap, ClipboardCheck, Calendar, Wifi, ScanFace, QrCode,
  Shield, Activity, Menu, X, ChevronLeft, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const navItems = {
  admin: [
    { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { label: 'Faculty', icon: Users, path: '/admin/faculty' },
    { label: 'Students', icon: GraduationCap, path: '/admin/students' },
    { label: 'Classes', icon: BookOpen, path: '/admin/classes' },
    { label: 'Reports', icon: BarChart3, path: '/admin/reports' },
    { label: 'System Health', icon: Activity, path: '/admin/health' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ],
  faculty: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/faculty' },
    { label: 'My Classes', icon: BookOpen, path: '/faculty/classes' },
    { label: 'Attendance', icon: ClipboardCheck, path: '/faculty/attendance' },
    { label: 'QR Scanner', icon: QrCode, path: '/faculty/scanner' },
    { label: 'Reports', icon: BarChart3, path: '/faculty/reports' },
    { label: 'Settings', icon: Settings, path: '/faculty/settings' },
  ],
  student: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/student' },
    { label: 'My Profile', icon: User, path: '/student/profile' },
    { label: 'Mark Attendance', icon: ScanFace, path: '/student/mark' },
    { label: 'My Classes', icon: Calendar, path: '/student/classes' },
    { label: 'Reports', icon: BarChart3, path: '/student/reports' },
    { label: 'Settings', icon: Settings, path: '/student/settings' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = navItems[user?.role] || [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-surface-200 dark:border-surface-700/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <h1 className="text-sm font-bold text-surface-900 dark:text-white leading-tight">Smart Attendance</h1>
            <p className="text-[10px] text-surface-500 uppercase tracking-wider">System v2.0</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                ${active
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                }`}
            >
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full"
                />
              )}
              <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-primary-500' : ''}`} />
              {!collapsed && <span>{item.label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface-900 dark:bg-surface-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-surface-200 dark:border-surface-700/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.avatar}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={logout} className="p-1.5 rounded-lg hover:bg-danger-500/10 text-surface-400 hover:text-danger-500 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white dark:bg-surface-800 shadow-lg border border-surface-200 dark:border-surface-700"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[260px] bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 z-50 shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col ${collapsed ? 'w-[72px]' : 'w-[260px]'} bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 transition-all duration-300 relative shrink-0`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-full flex items-center justify-center shadow-sm hover:shadow z-10 transition-shadow"
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}

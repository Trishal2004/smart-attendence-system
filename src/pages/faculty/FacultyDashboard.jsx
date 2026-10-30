import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, TrendingUp, Play, Calendar } from 'lucide-react';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import { mockClasses, mockDailyAttendance } from '../../data/mockData';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const trendData = [
  { day: 'Mon', rate: 92 }, { day: 'Tue', rate: 88 }, { day: 'Wed', rate: 95 },
  { day: 'Thu', rate: 85 }, { day: 'Fri', rate: 90 }, { day: 'Sat', rate: 82 },
];

const upcomingClasses = [
  { id: 1, name: 'Data Structures', code: 'CS201', time: '9:00 AM', room: 'LH-301', students: 45, status: 'upcoming' },
  { id: 2, name: 'Algorithms', code: 'CS301', time: '11:00 AM', room: 'LH-205', students: 38, status: 'upcoming' },
  { id: 3, name: 'Data Structures Lab', code: 'CS201L', time: '2:00 PM', room: 'Lab-3', students: 25, status: 'upcoming' },
];

export default function FacultyDashboard() {
  return (
    <div>
      <Navbar title="Faculty Dashboard" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={BookOpen} label="Today's Classes" value="4" change="1 more" changeType="up" color="primary" />
          <StatCard icon={Users} label="Total Students" value="158" color="success" />
          <StatCard icon={TrendingUp} label="Avg Attendance" value="89.5%" change="1.8%" changeType="up" color="warning" />
          <StatCard icon={Clock} label="Next Class" value="9:00 AM" color="primary" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Schedule cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-surface-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                Today's Schedule
              </h3>
              <span className="text-xs text-surface-500">Feb 23, 2026</span>
            </div>

            {upcomingClasses.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-surface-900 dark:text-white">{cls.name}</h4>
                    <p className="text-xs text-surface-500">{cls.code} • Room {cls.room} • {cls.students} students</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-surface-900 dark:text-white flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-surface-400" /> {cls.time}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-success-500 hover:bg-success-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Session
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Attendance trend */}
          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">This Week's Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="fGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={[75, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} formatter={(v) => [`${v}%`]} />
                <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2} fill="url(#fGrad)" />
              </AreaChart>
            </ResponsiveContainer>

            {/* Recent students */}
            <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
              <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Live Session Students</h4>
              <div className="space-y-2">
                {['Alice Johnson', 'Bob Williams', 'Carol Davis', 'David Brown'].map((name, i) => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-bold">
                        {name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-surface-700 dark:text-surface-300">{name}</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${i < 3 ? 'bg-success-500/10 text-success-500' : 'bg-warning-400/10 text-warning-500'}`}>
                      {i < 3 ? 'Present' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

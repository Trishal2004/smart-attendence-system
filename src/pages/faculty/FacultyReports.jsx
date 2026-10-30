import Navbar from '../../components/Navbar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { mockDailyAttendance } from '../../data/mockData';
import { Download } from 'lucide-react';

export default function FacultyReports() {
  return (
    <div>
      <Navbar title="My Reports" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Class Reports</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Weekly Attendance by Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockDailyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="present" fill="#6366f1" radius={[6, 6, 0, 0]} name="Present" />
              <Bar dataKey="absent" fill="#f87171" radius={[6, 6, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

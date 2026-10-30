import Navbar from '../../components/Navbar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { mockDailyAttendance, mockSubjectAttendance, mockHeatmapData } from '../../data/mockData';
import { Download } from 'lucide-react';

const PIE_COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#4f46e5'];

function HeatmapCell({ value }) {
  const intensity = Math.min(value / 100, 1);
  const bg = `rgba(99, 102, 241, ${intensity * 0.8 + 0.1})`;
  return (
    <div
      className="w-full h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-colors"
      style={{ backgroundColor: bg, color: intensity > 0.5 ? '#fff' : '#6366f1' }}
    >
      {value}
    </div>
  );
}

export default function AdminReports() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <Navbar title="Reports & Analytics" />
      <div className="p-6 space-y-6">
        {/* Export bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Analytics Overview</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Daily Attendance</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockDailyAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="present" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="absent" fill="#f87171" radius={[6, 6, 0, 0]} />
                <Bar dataKey="late" fill="#facc15" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Subject Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={mockSubjectAttendance} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3} stroke="none">
                  {mockSubjectAttendance.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} formatter={(v) => [`${v}%`, 'Rate']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Peak Attendance Hours Heatmap</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-surface-500 w-16">Time</th>
                  {days.map(d => (
                    <th key={d} className="px-1 py-2 text-xs font-semibold text-surface-500 text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockHeatmapData.map(row => (
                  <tr key={row.hour}>
                    <td className="px-3 py-1 text-xs font-medium text-surface-600 dark:text-surface-400">{row.hour}</td>
                    {days.map(d => (
                      <td key={d} className="px-1 py-1">
                        <HeatmapCell value={row[d]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import Navbar from '../../components/Navbar';
import CircularProgress from '../../components/CircularProgress';
import DataTable from '../../components/DataTable';
import { mockAttendanceHistory, mockSubjectAttendance } from '../../data/mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';

const PIE_COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#4f46e5'];

const historyColumns = [
  { key: 'date', label: 'Date' },
  { key: 'subject', label: 'Subject', render: (val) => <span className="font-medium text-surface-900 dark:text-white">{val}</span> },
  { key: 'status', label: 'Status', render: (val) => (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
      val === 'present' ? 'bg-success-500/10 text-success-500' :
      val === 'late' ? 'bg-warning-400/10 text-warning-500' :
      'bg-danger-500/10 text-danger-500'
    }`}>
      {val.charAt(0).toUpperCase() + val.slice(1)}
    </span>
  )},
  { key: 'method', label: 'Method' },
];

export default function StudentReports() {
  return (
    <div>
      <Navbar title="My Reports" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Attendance Analytics</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>

        {/* Circular progress */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-6">Subject-wise Attendance</h3>
          <div className="flex flex-wrap justify-center gap-8">
            {mockSubjectAttendance.map((s) => (
              <CircularProgress key={s.name} value={s.value} label={s.name} color={s.fill} />
            ))}
          </div>
        </div>

        {/* Pie chart */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Subject Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={mockSubjectAttendance} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={3} stroke="none">
                  {mockSubjectAttendance.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} formatter={(v) => [`${v}%`, 'Rate']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Weekly Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={[
                { day: 'Mon', attended: 3, missed: 0 },
                { day: 'Tue', attended: 2, missed: 1 },
                { day: 'Wed', attended: 3, missed: 0 },
                { day: 'Thu', attended: 2, missed: 0 },
                { day: 'Fri', attended: 2, missed: 1 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="attended" fill="#6366f1" radius={[6, 6, 0, 0]} name="Attended" />
                <Bar dataKey="missed" fill="#f87171" radius={[6, 6, 0, 0]} name="Missed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History table */}
        <DataTable
          title="Attendance History"
          columns={historyColumns}
          data={mockAttendanceHistory}
          onExport={(type) => alert(`Exporting as ${type.toUpperCase()}...`)}
        />
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { User, Mail, BookOpen, GraduationCap, Hash, TrendingUp, Calendar, Shield } from 'lucide-react';
import Navbar from '../../components/Navbar';
import CircularProgress from '../../components/CircularProgress';
import { useAuth } from '../../context/AuthContext';
import { mockStudents, mockSubjectAttendance } from '../../data/mockData';

export default function StudentProfile() {
  const { user } = useAuth();

  // Find the student record from mock data (match by id or fallback to first)
  const student = mockStudents.find(s => s.id === user?.id) || {
    id: user?.id || 'STU001',
    name: user?.name || 'Alice Johnson',
    email: user?.email || 'alice@university.edu',
    department: 'Computer Science',
    year: 3,
    attendance: 92,
  };

  const infoFields = [
    { icon: Hash, label: 'Student ID', value: student.id },
    { icon: User, label: 'Full Name', value: student.name },
    { icon: Mail, label: 'Email Address', value: student.email },
    { icon: BookOpen, label: 'Department', value: student.department },
    { icon: GraduationCap, label: 'Year', value: `Year ${student.year}` },
    { icon: TrendingUp, label: 'Overall Attendance', value: `${student.attendance}%` },
    { icon: Calendar, label: 'Academic Year', value: '2025-2026' },
    { icon: Shield, label: 'Status', value: student.attendance >= 75 ? 'Good Standing' : 'Attendance Warning' },
  ];

  return (
    <div>
      <Navbar title="My Profile" />
      <div className="p-6 space-y-6">

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white" />
          </div>
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold">{student.name}</h1>
              <p className="text-primary-200 text-sm mt-1">{student.id} • {student.department} • Year {student.year}</p>
              <p className="text-primary-200 text-sm">{student.email}</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">

          {/* Student Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6"
          >
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-6">Student Information</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {infoFields.map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-400">{label}</p>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Subject-wise attendance */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Subject-wise Attendance</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {mockSubjectAttendance.map((s) => (
                  <CircularProgress key={s.name} value={s.value} label={s.name} color={s.fill} size={90} strokeWidth={7} />
                ))}
              </div>
            </div>

            {/* Attendance info */}
            <div className="mt-8 bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-800 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-2">How Attendance Works</h4>
              <div className="space-y-2">
                {[
                  { step: '1', text: 'Faculty starts an attendance session' },
                  { step: '2', text: 'The system verifies your identity via Decision Fusion (Face + Wi-Fi)' },
                  { step: '3', text: 'Attendance is marked automatically and reflected in your records' },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold shrink-0">{step}</span>
                    <span className="text-surface-600 dark:text-surface-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

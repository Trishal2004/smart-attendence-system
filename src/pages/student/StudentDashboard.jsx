import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, TrendingUp, ScanFace } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import CircularProgress from '../../components/CircularProgress';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi, attendanceApi } from '../../services/api';

const CIRCLE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [studentStats, setStudentStats] = useState({ overallAttendancePercentage: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadStudentStats = async () => {
      if (!user?.id) {
        setStatsLoading(false);
        return;
      }

      try {
        setStatsLoading(true);
        // Call the specific endpoint just for overall percentage
        const stats = await attendanceApi.getOverallAttendancePercentage(user.id);

        if (isMounted) {
          setStudentStats(stats || { overallAttendancePercentage: 0 });
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Failed to load student stats.');
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    loadStudentStats();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await dashboardApi.getStudentDashboard(user.id);

        if (isMounted) {
          setDashboardData(data || null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Failed to load student dashboard.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const courseAttendance = dashboardData?.courses || [];
  const recentAttendance = dashboardData?.recentAttendance || [];

  const attendanceSummary = useMemo(() => {
    const totals = courseAttendance.reduce(
      (acc, course) => {
        acc.totalClasses += Number(course.totalClasses || 0);
        acc.attendedClasses += Number(course.attendedClasses || 0);
        return acc;
      },
      { totalClasses: 0, attendedClasses: 0 }
    );

    return totals;
  }, [courseAttendance]);

  const overallAttendance = Number(studentStats?.overallAttendancePercentage ?? 0).toFixed(1);

  return (
    <div>
      <Navbar title="Student Dashboard" />
      <div className="p-6 space-y-6">
        {error && (
          <div className="rounded-xl border border-danger-300/40 bg-danger-500/10 px-4 py-3 text-sm text-danger-500">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={TrendingUp}
            label="Overall Attendance"
            value={statsLoading ? '...' : `${overallAttendance}%`}
            color="primary"
          />
          <StatCard
            icon={BookOpen}
            label="Enrolled Classes"
            value={loading ? '...' : courseAttendance.length}
            color="success"
          />
          <StatCard
            icon={Calendar}
            label="Total Sessions"
            value={loading ? '...' : attendanceSummary.totalClasses}
            color="warning"
          />
          <StatCard
            icon={Clock}
            label="Attended Sessions"
            value={loading ? '...' : attendanceSummary.attendedClasses}
            color="primary"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Attendance circles */}
          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-6">Subject Attendance</h3>
            <div className="grid grid-cols-2 gap-6">
              {courseAttendance.length > 0 ? (
                courseAttendance.slice(0, 4).map((course, index) => (
                  <CircularProgress
                    key={course.courseId}
                    value={Number(course.attendancePercentage ?? 0)}
                    label={course.courseCode || course.courseName}
                    color={CIRCLE_COLORS[index % CIRCLE_COLORS.length]}
                    size={100}
                    strokeWidth={8}
                  />
                ))
              ) : (
                <p className="text-sm text-surface-500 col-span-2">No attendance records available yet.</p>
              )}
            </div>
          </div>

          {/* Upcoming classes */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-surface-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                Enrolled Courses
              </h3>
              <Link
                to="/student/mark"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
              >
                <ScanFace className="w-4 h-4" /> Mark Attendance
              </Link>
            </div>

            {courseAttendance.length > 0 ? (
              courseAttendance.map((course, i) => (
                <motion.div
                  key={course.courseId}
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
                      <h4 className="font-semibold text-surface-900 dark:text-white">{course.courseName}</h4>
                      <p className="text-xs text-surface-500">{course.courseCode} • {course.attendedClasses}/{course.totalClasses} attended</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                    <Clock className="w-4 h-4" />
                    {Number(course.attendancePercentage ?? 0).toFixed(1)}%
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5 text-sm text-surface-500">
                No enrolled courses found.
              </div>
            )}

            {/* Recent history */}
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Recent Attendance</h3>
              <div className="space-y-2">
                {recentAttendance.length > 0 ? (
                  recentAttendance.map((record) => {
                    const normalizedStatus = String(record.status || '').toLowerCase();
                    const badgeClass =
                      normalizedStatus === 'present'
                        ? 'bg-success-500/10 text-success-500'
                        : normalizedStatus === 'late'
                          ? 'bg-warning-400/10 text-warning-500'
                          : 'bg-danger-500/10 text-danger-500';

                    return (
                      <div key={record.recordId} className="flex items-center justify-between text-sm py-1.5">
                        <div>
                          <span className="text-surface-700 dark:text-surface-300">
                            {record.courseName} ({record.courseCode})
                          </span>
                          <span className="text-xs text-surface-400 ml-2">
                            {record.sessionDate ? new Date(record.sessionDate).toLocaleDateString() : '-'}
                          </span>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeClass}`}>
                          {record.status ? String(record.status).charAt(0).toUpperCase() + String(record.status).slice(1).toLowerCase() : 'Unknown'}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-surface-500">No recent attendance records yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

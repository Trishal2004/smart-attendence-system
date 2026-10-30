import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { Play, StopCircle, Users, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { attendanceApi, dashboardApi } from '../../services/api';

export default function FacultyAttendance() {
  const { user } = useAuth();
  const [sessionActive, setSessionActive] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);
  
  const [snapshot, setSnapshot] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const [error, setError] = useState('');
  
  // To track instantly verified students
  const [recentVerifications, setRecentVerifications] = useState([]);
  const previousPresentRef = useRef(new Set());

  const selectedCourse = useMemo(
    () => courses.find((course) => course.courseId === selectedCourseId) || null,
    [courses, selectedCourseId]
  );

  const loadLiveSnapshot = useCallback(async (showLoader = false) => {
    if (!activeSessionId) {
      return;
    }

    try {
      if (showLoader) {
        setLoadingSnapshot(true);
      }
      const data = await attendanceApi.getLiveSessionAttendance(activeSessionId);
      setSnapshot(data);
      setError('');
    } catch (apiError) {
      setError(apiError.message || 'Failed to fetch live attendance.');
    } finally {
      if (showLoader) {
        setLoadingSnapshot(false);
      }
    }
  }, [activeSessionId]);

  useEffect(() => {
    if (!snapshot?.students) return;

    // Detect students who just became 'PRESENT' (AI Verified)
    const currentPresent = new Set(
      snapshot.students
        .filter((s) => s.status?.toLowerCase() === 'present')
        .map((s) => s.studentId)
    );

    const newlyVerified = snapshot.students.filter(
      (s) =>
        s.status?.toLowerCase() === 'present' &&
        !previousPresentRef.current.has(s.studentId)
    );

    if (newlyVerified.length > 0 && previousPresentRef.current.size > 0) {
      const newNotifications = newlyVerified.map(student => ({
        id: Date.now() + Math.random(),
        name: student.studentName || 'Student',
        verificationMethod: student.verificationMethod || 'AI Fusion'
      }));

      setRecentVerifications((prev) => [...prev, ...newNotifications]);

      // Dismiss tracking visually after 4 seconds
      setTimeout(() => {
        setRecentVerifications((prev) => 
          prev.filter((v) => !newNotifications.find(n => n.id === v.id))
        );
      }, 4000);
    }

    previousPresentRef.current = currentPresent;
  }, [snapshot]);

  const loadCourses = useCallback(async () => {
    if (!user?.id) {
      setLoadingCourses(false);
      return;
    }

    try {
      setLoadingCourses(true);
      const facultyCourses = await dashboardApi.getFacultyCourses(user.id);
      
      setCourses(facultyCourses || []);

      if (facultyCourses?.length > 0) {
        setSelectedCourseId((current) => {
          if (current && facultyCourses.some((course) => course.courseId === current)) {
            return current;
          }
          return facultyCourses[0].courseId;
        });
      } else {
        setSelectedCourseId(null);
      }

      setSessionActive(false);
      setActiveSessionId(null);
      setSnapshot(null);
      setError('');
    } catch (apiError) {
      setError(apiError.message || 'Failed to fetch courses.');
    } finally {
      setLoadingCourses(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (activeSessionId) {
      loadLiveSnapshot(true);
    }
  }, [activeSessionId, loadLiveSnapshot]);

  useEffect(() => {
    if (!sessionActive || !activeSessionId) {
      return;
    }

    // Faster polling interval for real-time AI updates
    const interval = setInterval(() => {
      loadLiveSnapshot(false);
    }, 1000); // 1 second for near-instant updates

    return () => clearInterval(interval);
  }, [sessionActive, activeSessionId, loadLiveSnapshot]);

  const startSession = async () => {
    if (!selectedCourseId || !user?.id) {
      return;
    }

    try {
      const response = await attendanceApi.startCourseSession(user.id, selectedCourseId);
      setActiveSessionId(response.sessionId);
      setSessionActive(true);
      await loadLiveSnapshot(false);
      setError('');
    } catch (apiError) {
      setError(apiError.message || 'Failed to start session.');
    }
  };

  const stopSession = async () => {
    if (!activeSessionId || !user?.id) {
      return;
    }

    try {
      await attendanceApi.endClassSession(user.id, activeSessionId);
      setSessionActive(false);
      setActiveSessionId(null);
      setError('');
    } catch (apiError) {
      setError(apiError.message || 'Failed to end session.');
    }
  };

  const studentStatuses = (snapshot?.students || []).map((student) => ({
    id: student.studentId,
    code: student.studentCode || `SID-${student.studentId}`,
    name: student.studentName || 'Unknown Student',
    status: (student.status || 'PENDING').toLowerCase(),
  }));

  const present = snapshot?.presentCount ?? studentStatuses.filter((s) => s.status === 'present').length;
  const absent = snapshot?.absentCount ?? studentStatuses.filter((s) => s.status === 'absent').length;
  const pending = snapshot?.pendingCount ?? studentStatuses.filter((s) => s.status === 'pending').length;

  return (
    <div className="relative">
      {/* Live Verifications Overlay */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {recentVerifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="bg-white dark:bg-surface-800 shadow-xl border-l-4 border-success-500 rounded-lg p-4 flex items-center gap-3 w-72"
            >
              <div className="bg-success-100 text-success-600 rounded-full p-1.5 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-surface-900 dark:text-white">
                  {notif.name}
                </p>
                <p className="text-xs text-surface-500 font-medium">
                  Verified via {notif.verificationMethod}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Navbar title="Attendance Session" />
      <div className="p-6 space-y-6">
        {/* Session control */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                {sessionActive ? 'Session Active' : 'Start New Session'}
              </h2>
              {loadingCourses ? (
                <p className="text-sm text-surface-500 mt-1">Loading courses...</p>
              ) : selectedCourse ? (
                <p className="text-sm text-surface-500 mt-1">
                  {selectedCourse.courseName} ({selectedCourse.courseCode})
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-4">
                  <p className="text-sm text-danger-500">No courses available.</p>
                  <button 
                    onClick={loadCourses} 
                    className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                  >
                    Force Reload Courses
                  </button>
                </div>
              )}
            </div>

            {courses.length > 0 && !sessionActive && (
              <select
                value={selectedCourseId || ''}
                onChange={(event) => setSelectedCourseId(Number(event.target.value))}
                className="px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white"
              >
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => loadLiveSnapshot(false)}
                disabled={!activeSessionId || loadingSnapshot}
                className="px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 text-sm font-medium rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors disabled:opacity-50"
              >
                Refresh
              </button>
              <motion.button
                whileHover={{ scale: (!sessionActive && !selectedCourseId) ? 1 : 1.03 }}
                whileTap={{ scale: (!sessionActive && !selectedCourseId) ? 1 : 0.97 }}
                onClick={sessionActive ? stopSession : startSession}
                disabled={!sessionActive && !selectedCourseId}
                className={`flex items-center gap-2 px-6 py-3 text-white text-sm font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                  sessionActive
                    ? 'bg-danger-500 hover:bg-danger-500/90'
                    : 'bg-success-500 hover:bg-success-600'
                }`}
              >
                {sessionActive ? <><StopCircle className="w-4 h-4" /> End Session</> : <><Play className="w-4 h-4" /> Start Attendance</>}
              </motion.button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-500">
              {error}
            </div>
          )}

          {/* Quick stats */}
          {sessionActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-surface-200 dark:border-surface-700"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-success-500">{present}</p>
                <p className="text-xs text-surface-500">Present</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-danger-500">{absent}</p>
                <p className="text-xs text-surface-500">Absent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning-500">{pending}</p>
                <p className="text-xs text-surface-500">Pending</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Student list */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-500" />
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Student List</h3>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-800/50">
            {loadingSnapshot && studentStatuses.length === 0 && (
              <div className="px-5 py-6 text-sm text-surface-500">Loading attendance snapshot...</div>
            )}

            {!loadingSnapshot && studentStatuses.length === 0 && activeSessionId && (
              <div className="px-5 py-6 text-sm text-surface-500">
                No enrolled students were found for this session. The class list is empty.
              </div>
            )}

            {!activeSessionId && (
              <div className="px-5 py-6 text-sm text-surface-500">
                Start a session to view enrolled students.
              </div>
            )}

            {studentStatuses.map((student, i) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between px-5 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {student.name.split(' ').map((namePart) => namePart[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{student.name}</p>
                    <p className="text-xs text-surface-500">{student.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {student.status === 'present' && (
                    <span className="flex items-center gap-1 text-xs font-medium text-success-500 bg-success-500/10 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Present
                    </span>
                  )}
                  {student.status === 'absent' && (
                    <span className="flex items-center gap-1 text-xs font-medium text-danger-500 bg-danger-500/10 px-2.5 py-1 rounded-full">
                      <XCircle className="w-3.5 h-3.5" /> Absent
                    </span>
                  )}
                  {student.status === 'pending' && (
                    <span className="flex items-center gap-1 text-xs font-medium text-warning-500 bg-warning-400/10 px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

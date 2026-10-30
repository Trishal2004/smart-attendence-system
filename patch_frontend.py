import re

with open("src/pages/faculty/FacultyAttendance.jsx", "r") as f:
    content = f.read()

content = content.replace("import { QRCodeCanvas } from 'qrcode.react';", "")

content = content.replace("const [sessions, setSessions] = useState([]);", "const [courses, setCourses] = useState([]);")
content = content.replace("const [selectedSessionId, setSelectedSessionId] = useState(null);", "const [selectedCourseId, setSelectedCourseId] = useState(null);\n  const [activeSessionId, setActiveSessionId] = useState(null);")
content = content.replace("const [qrToken, setQrToken] = useState(null);", "")
content = content.replace("const [loadingSessions, setLoadingSessions] = useState(true);", "const [loadingCourses, setLoadingCourses] = useState(true);")

content = content.replace("""  const selectedSession = useMemo(
    () => sessions.find((session) => session.sessionId === selectedSessionId) || null,
    [sessions, selectedSessionId]
  );""", """  const selectedCourse = useMemo(
    () => courses.find((course) => course.courseId === selectedCourseId) || null,
    [courses, selectedCourseId]
  );""")


content = content.replace("""  const loadLiveSnapshot = useCallback(async (showLoader = false) => {
    if (!selectedSessionId) {
      return;
    }

    try {
      if (showLoader) {
        setLoadingSnapshot(true);
      }
      const data = await attendanceApi.getLiveSessionAttendance(selectedSessionId);""", """  const loadLiveSnapshot = useCallback(async (showLoader = false) => {
    if (!activeSessionId) {
      return;
    }

    try {
      if (showLoader) {
        setLoadingSnapshot(true);
      }
      const data = await attendanceApi.getLiveSessionAttendance(activeSessionId);""")

content = content.replace("}, [selectedSessionId]);", "}, [activeSessionId]);")

content = content.replace("""  const loadSchedule = useCallback(async () => {
    if (!user?.id) {
      setLoadingSessions(false);
      return;
    }

    try {
      setLoadingSessions(true);
      const dateSessions = await dashboardApi.getFacultyTodaySchedule(user.id);
      
      setSessions(dateSessions || []);

      if (dateSessions?.length > 0) {
        setSelectedSessionId((current) => {
          if (current && dateSessions.some((session) => session.sessionId === current)) {
            return current;
          }
          return dateSessions[0].sessionId;
        });
      } else {
        setSelectedSessionId(null);
      }

      setSessionActive(false);
      setQrToken(null);
      setSnapshot(null);
      setError('');
    } catch (apiError) {
      setError(apiError.message || 'Failed to fetch sessions.');
    } finally {
      setLoadingSessions(false);
    }
  }, [user?.id]);""", """  const loadCourses = useCallback(async () => {
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
  }, [user?.id]);""")

content = content.replace("loadSchedule();", "loadCourses();")
content = content.replace("[loadSchedule]", "[loadCourses]")

content = content.replace("""  useEffect(() => {
    if (selectedSessionId) {
      loadLiveSnapshot(true);
    }
  }, [selectedSessionId, loadLiveSnapshot]);""", """  useEffect(() => {
    if (activeSessionId) {
      loadLiveSnapshot(true);
    }
  }, [activeSessionId, loadLiveSnapshot]);""")

content = content.replace("""  useEffect(() => {
    if (!sessionActive || !selectedSessionId) {
      return;
    }""", """  useEffect(() => {
    if (!sessionActive || !activeSessionId) {
      return;
    }""")

content = content.replace("}, [sessionActive, selectedSessionId, loadLiveSnapshot]);", "}, [sessionActive, activeSessionId, loadLiveSnapshot]);")

content = content.replace("""  const startSession = async () => {
    if (!selectedSessionId || !user?.id) {
      return;
    }

    try {
      const response = await attendanceApi.startClassSession(user.id, selectedSessionId);
      setQrToken(response?.currentQrToken || 'DEMO_TOKEN_123'); // Fallback token if missing
      setSessionActive(true);
      await loadLiveSnapshot(false);
      setError('');
    } catch (apiError) {
      setError(apiError.message || 'Failed to start session.');
    }
  };""", """  const startSession = async () => {
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
  };""")

content = content.replace("""  const stopSession = async () => {
    if (!selectedSessionId || !user?.id) {
      return;
    }

    try {
      await attendanceApi.endClassSession(user.id, selectedSessionId);
      setSessionActive(false);
      setQrToken(null);
      setError('');
    } catch (apiError) {
      setError(apiError.message || 'Failed to end session.');
    }
  };""", """  const stopSession = async () => {
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
  };""")


content = content.replace("{loadingSessions ?", "{loadingCourses ?")
content = content.replace("Loading sessions...</p>", "Loading courses...</p>")
content = content.replace(") : selectedSession ?", ") : selectedCourse ?")
content = content.replace("{selectedSession.courseName} ({selectedSession.courseCode}) • {selectedSession.roomNumber || 'TBA'}", "{selectedCourse.courseName} ({selectedCourse.courseCode})")
content = content.replace("No sessions available.", "No courses available.")
content = content.replace("onClick={loadSchedule}", "onClick={loadCourses}")
content = content.replace("Force Reload Schedule", "Force Reload Courses")


content = content.replace("""            {sessions.length > 0 && (
              <select
                value={selectedSessionId || ''}
                onChange={(event) => setSelectedSessionId(Number(event.target.value))}
                className="px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-sm text-surface-900 dark:text-white"
              >
                {sessions.map((session) => (
                  <option key={session.sessionId} value={session.sessionId}>
                    {session.courseCode} - {session.sessionDate} - {session.roomNumber || 'TBA'}
                  </option>
                ))}
              </select>
            )}""", """            {courses.length > 0 && !sessionActive && (
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
            )}""")


content = content.replace("disabled={!selectedSessionId || loadingSnapshot}", "disabled={!activeSessionId || loadingSnapshot}")
content = content.replace("whileHover={{ scale: selectedSessionId ? 1.03 : 1 }}", "whileHover={{ scale: (!sessionActive && !selectedCourseId) ? 1 : 1.03 }}")
content = content.replace("whileTap={{ scale: selectedSessionId ? 0.97 : 1 }}", "whileTap={{ scale: (!sessionActive && !selectedCourseId) ? 1 : 0.97 }}")
content = content.replace("disabled={!selectedSessionId}", "disabled={!sessionActive && !selectedCourseId}")


# Regex for QR code component removal
qr_code_regex = re.compile(
    r"\{\/\* QR Code Display section! \*\/\}.*?\{\/\* Quick stats \*\/\}",
    re.DOTALL
)

content = qr_code_regex.sub("{/* Quick stats */}", content)

content = content.replace("import { Play, StopCircle, Users, CheckCircle2, XCircle, Clock, QrCode } from 'lucide-react';", "import { Play, StopCircle, Users, CheckCircle2, XCircle, Clock } from 'lucide-react';")

content = content.replace("selectedSessionId && (", "activeSessionId && (")
content = content.replace("!selectedSessionId && (", "!activeSessionId && (")
content = content.replace("Select a session above to view enrolled students.", "Start a session to view enrolled students.")

with open("src/pages/faculty/FacultyAttendance.jsx", "w") as f:
    f.write(content)

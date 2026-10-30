import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

let authTokenGetter = null;

export const setAuthTokenGetter = (tokenGetter) => {
  authTokenGetter = tokenGetter;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    let token = authTokenGetter?.();
    if (!token) {
      token = localStorage.getItem('token');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const fallbackMessage = 'Request failed. Please try again.';
    const message =
      error?.response?.data?.message ||
      (typeof error?.response?.data === 'string' ? error.response.data : null) ||
      error?.message ||
      fallbackMessage;

    return Promise.reject(new Error(message));
  }
);

export const dashboardApi = {
  getStudentDashboard(studentId) {
    return apiClient.get(`/student/${studentId}/dashboard`).then((res) => res.data);
  },

  async getStudentStats(studentId) {
    const data = await apiClient.get(`/student/${studentId}/dashboard`).then((res) => res.data);
    return {
      overallAttendancePercentage: data?.overallAttendancePercentage ?? 0,
      totalCourses: Array.isArray(data?.courses) ? data.courses.length : 0,
      totalClasses: Array.isArray(data?.courses)
        ? data.courses.reduce((sum, course) => sum + Number(course?.totalClasses || 0), 0)
        : 0,
      attendedClasses: Array.isArray(data?.courses)
        ? data.courses.reduce((sum, course) => sum + Number(course?.attendedClasses || 0), 0)
        : 0,
    };
  },

  getFacultyTodaySchedule(facultyId) {
    return apiClient.get(`/faculty/${facultyId}/schedule/today`).then((res) => res.data);
  },

  getFacultyScheduleByDate(facultyId, date) {
    return apiClient.get(`/faculty/${facultyId}/schedule`, {
      params: { date },
    }).then((res) => res.data);
  },

  getFacultyCourses(facultyId) {
    return apiClient.get(`/faculty/${facultyId}/courses`).then((res) => res.data);
  },
  
  deprecatedGetFacultyCourses(facultyId, date) {
    if (date) {
      return apiClient.get(`/faculty/${facultyId}/schedule`, {
        params: { date },
      }).then((res) => res.data);
    }

    return apiClient.get(`/faculty/${facultyId}/schedule/today`).then((res) => res.data);
  },

  // Keep this ready for when backend admin dashboard endpoint is implemented.
  getAdminDashboard() {
    return apiClient.get('/admin/analytics/summary').then((res) => res.data);
  },

  async getAdminOverviewStats() {
    const [counts, summary] = await Promise.all([
      apiClient.get('/admin/analytics/counts').then((res) => res.data),
      apiClient.get('/admin/analytics/summary').then((res) => res.data),
    ]);

    return {
      totalStudents: counts?.totalStudents ?? 0,
      totalFaculty: counts?.totalFaculty ?? 0,
      totalClasses: counts?.totalClasses ?? 0,
      activeStudents: summary?.activeStudents ?? 0,
      activeFaculty: summary?.activeFaculty ?? 0,
      classesToday: summary?.classesToday ?? 0,
      date: summary?.date ?? null,
    };
  },
};

export const attendanceApi = {
  submitQrAttendance(payload) {
    return apiClient.post('/student/attendance/mark', payload).then((res) => res.data);
  },

  submitSmartAttendance(payload) {
    return apiClient.post('/student/attendance/mark-smart', payload).then((res) => res.data);
  },

  getLiveAttendance(sessionId) {
    return apiClient.get(`/faculty/session/${sessionId}/attendance/live`).then((res) => res.data);
  },

  getLiveSessionAttendance(sessionId) {
    return this.getLiveAttendance(sessionId);
  },

  markSessionAttendance(sessionId, payload) {
    return apiClient.post(`/faculty/session/${sessionId}/attendance`, payload).then((res) => res.data);
  },

  startClassSession(facultyId, sessionId) {
    return apiClient.post(`/faculty/${facultyId}/session/${sessionId}/start`).then((res) => res.data);
  },

  startCourseSession(facultyId, courseId) {
    return apiClient.post(`/faculty/${facultyId}/course/${courseId}/start`).then((res) => res.data);
  },

  endClassSession(facultyId, sessionId) {
    return apiClient.post(`/faculty/${facultyId}/session/${sessionId}/end`).then((res) => res.data);
  },

  getOverallAttendancePercentage(studentId) {
    return apiClient.get(`/student/attendance/analytics/${studentId}/overall-percentage`).then((res) => res.data);
  }
};

export const adminApi = {
  registerStudent(payload) {
    return apiClient.post('/admin/students/register', payload).then((res) => res.data);
  },

  registerFaculty(payload) {
    return apiClient.post('/admin/faculty/register', payload).then((res) => res.data);
  },

  createCourse(payload) {
    return apiClient.post('/admin/courses', payload).then((res) => res.data);
  },

  assignFacultyToCourse(payload) {
    return apiClient.post('/admin/courses/assign-faculty', payload).then((res) => res.data);
  },

  getAdminCounts() {
    return apiClient.get('/admin/analytics/counts').then((res) => res.data);
  },

  getDashboardSummary() {
    return apiClient.get('/admin/analytics/summary').then((res) => res.data);
  },

  getSystemAttendanceOverview() {
    return apiClient.get('/admin/attendance/overview').then((res) => res.data);
  },

  getDailyAttendanceAnalytics(days = 7) {
    return apiClient.get('/admin/analytics/attendance', {
      params: { days },
    }).then((res) => res.data);
  },
};

export default apiClient;
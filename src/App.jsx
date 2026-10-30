import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/DashboardLayout';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFaculty from './pages/admin/AdminFaculty';
import AdminStudents from './pages/admin/AdminStudents';
import AdminClasses from './pages/admin/AdminClasses';
import AdminReports from './pages/admin/AdminReports';
import AdminHealth from './pages/admin/AdminHealth';
import AdminSettings from './pages/admin/AdminSettings';

// Faculty
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyClasses from './pages/faculty/FacultyClasses';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import QRScanner from './pages/faculty/QRScanner';
import FacultyReports from './pages/faculty/FacultyReports';
import FacultySettings from './pages/faculty/FacultySettings';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import AttendancePortal from './pages/student/AttendancePortal';
import StudentProfile from './pages/student/StudentProfile';
import StudentClasses from './pages/student/StudentClasses';
import StudentReports from './pages/student/StudentReports';
import StudentSettings from './pages/student/StudentSettings';

function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" />;
  if (allowedRole && user?.role !== allowedRole) return <Navigate to={`/${user?.role}`} />;
  return children;
}

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="faculty" element={<AdminFaculty />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="health" element={<AdminHealth />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Faculty Routes */}
        <Route path="/faculty" element={<ProtectedRoute allowedRole="faculty"><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<FacultyDashboard />} />
          <Route path="classes" element={<FacultyClasses />} />
          <Route path="attendance" element={<FacultyAttendance />} />
          <Route path="scanner" element={<QRScanner />} />
          <Route path="reports" element={<FacultyReports />} />
          <Route path="settings" element={<FacultySettings />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute allowedRole="student"><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="mark" element={<AttendancePortal />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="classes" element={<StudentClasses />} />
          <Route path="reports" element={<StudentReports />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;

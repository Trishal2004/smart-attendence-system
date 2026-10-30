import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, EyeOff, Mail, Lock, User, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    studentId: '',
    employeeId: '',
    department: '',
    phone: ''
  });
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password, role);
        if (success) {
          // Read role from the stored user (set by login()) rather than UI tab
          const storedUser = JSON.parse(localStorage.getItem('user'));
          const actualRole = storedUser?.role || role;
          const routes = { admin: '/admin', faculty: '/faculty', student: '/student' };
          navigate(routes[actualRole] || routes[role]);
        }
      } else {
        // Signup
        const signupData = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: role.toUpperCase(),
          department: formData.department,
          phone: formData.phone
        };

        // Add role-specific fields
        if (role === 'student') {
          signupData.studentId = formData.studentId;
        } else if (role === 'faculty') {
          signupData.employeeId = formData.employeeId;
        }

        const success = await signup(signupData);
        if (success) {
          setIsLogin(true);
          setFormData({
            email: '',
            password: '',
            fullName: '',
            studentId: '',
            employeeId: '',
            department: '',
            phone: ''
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { key: 'student', label: 'Student' },
    { key: 'faculty', label: 'Faculty' },
    { key: 'admin', label: 'Admin' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-surface-50 via-white to-primary-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          title="Go to Home"
        >
          <Home className="w-5 h-5 text-surface-600 dark:text-surface-400" />
        </button>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Glass card */}
        <div className="glass rounded-3xl p-8 shadow-2xl bg-white/70 dark:bg-surface-900/70 border border-surface-200/50 dark:border-surface-700/30">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm text-surface-500 mt-1">
              {isLogin ? 'Sign in to your account' : 'Start your journey with us'}
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-surface-100 dark:bg-surface-800 rounded-xl p-1 mb-6">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  role === r.key
                    ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-surface-900 dark:text-white placeholder:text-surface-400"
                    />
                  </div>

                  {role === 'student' && (
                    <div className="relative">
                      <input
                        type="text"
                        name="studentId"
                        placeholder="Student ID"
                        value={formData.studentId}
                        onChange={handleChange}
                        required={!isLogin && role === 'student'}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-surface-900 dark:text-white placeholder:text-surface-400"
                      />
                    </div>
                  )}

                  {role === 'faculty' && (
                    <div className="relative">
                      <input
                        type="text"
                        name="employeeId"
                        placeholder="Employee ID"
                        value={formData.employeeId}
                        onChange={handleChange}
                        required={!isLogin && role === 'faculty'}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-surface-900 dark:text-white placeholder:text-surface-400"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="text"
                      name="department"
                      placeholder="Department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-surface-900 dark:text-white placeholder:text-surface-400"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-surface-900 dark:text-white placeholder:text-surface-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-surface-900 dark:text-white placeholder:text-surface-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type={showPwd ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full pl-10 pr-11 py-3 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-surface-900 dark:text-white placeholder:text-surface-400"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-surface-500">
                  <input type="checkbox" className="rounded border-surface-300 text-primary-500 focus:ring-primary-500" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">Forgot password?</a>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-surface-500 mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

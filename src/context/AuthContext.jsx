import { createContext, useContext, useState, useEffect } from 'react';
import { setAuthTokenGetter } from '../services/api';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/auth` : 'http://localhost:8081/api/auth';

const parseApiError = async (response, fallbackMessage) => {
  try {
    const data = await response.json();

    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    if (data && typeof data === 'object') {
      const firstValidationError = Object.values(data).find(
        (value) => typeof value === 'string' && value.trim()
      );
      if (firstValidationError) {
        return firstValidationError;
      }
    }
  } catch {
    // Ignore JSON parse errors and use fallback message.
  }

  return fallbackMessage;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (token in localStorage)
    const storedToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (storedToken && userData) {
      setUser(JSON.parse(userData));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setAuthTokenGetter(() => token);
  }, [token]);

  const login = async (email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await parseApiError(response, 'Login failed');
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Clear any stale auth data before storing fresh data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.fullName,
        email: data.email,
        role: data.role.toLowerCase(),
        studentId: data.studentId,
        employeeId: data.employeeId,
        avatar: data.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
      }));

      setUser({
        id: data.id,
        name: data.fullName,
        email: data.email,
        role: data.role.toLowerCase(),
        studentId: data.studentId,
        employeeId: data.employeeId,
        avatar: data.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
      });
      setToken(data.token);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const signup = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email: formData.email?.trim(),
        }),
      });

      if (!response.ok) {
        const errorMessage = await parseApiError(response, 'Signup failed');
        throw new Error(errorMessage);
      }

      const data = await response.json();
      alert('Account created successfully! Please login.');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.message || 'Signup failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { studyApi } from '../api/studyApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cinnamon_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cinnamon_token'));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await studyApi.getUserStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch {
      // Ignored if unauthenticated or error
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res && res.data) {
            setUser((prev) => ({ ...prev, ...res.data }));
            localStorage.setItem('cinnamon_user', JSON.stringify(res.data));
            await fetchStats();
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const data = res.data;
    localStorage.setItem('cinnamon_token', data.token);
    localStorage.setItem('cinnamon_user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    await fetchStats();
    return data;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    const data = res.data;
    localStorage.setItem('cinnamon_token', data.token);
    localStorage.setItem('cinnamon_user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    await fetchStats();
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cinnamon_token');
    localStorage.removeItem('cinnamon_user');
    setToken(null);
    setUser(null);
    setStats(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        stats,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'ADMIN',
        isTeacher: user?.role === 'TEACHER' || user?.role === 'ADMIN',
        login,
        register,
        logout,
        refreshStats: fetchStats,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

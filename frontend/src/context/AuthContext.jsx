import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('he_token'));
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('he_user');
    return cached ? JSON.parse(cached) : null;
  });

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('he_token', data.token);
    localStorage.setItem('he_user', JSON.stringify(data.user));
  };

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('he_token', data.token);
    localStorage.setItem('he_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('he_token');
    localStorage.removeItem('he_user');
  };

  const value = useMemo(
    () => ({ token, user, login, signup, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

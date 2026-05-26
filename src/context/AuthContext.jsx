import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext(null);

const STORAGE_KEY_USER  = 'ams_user';
const STORAGE_KEY_TOKEN = 'ams_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Migrate any old nexus_* keys from previous session
    const legacyUser  = localStorage.getItem('nexus_user');
    const legacyToken = localStorage.getItem('nexus_token');
    if (legacyUser)  { localStorage.setItem(STORAGE_KEY_USER,  legacyUser);  localStorage.removeItem('nexus_user');  }
    if (legacyToken) { localStorage.setItem(STORAGE_KEY_TOKEN, legacyToken); localStorage.removeItem('nexus_token'); }

    // Load persisted auth
    const storedUser  = localStorage.getItem(STORAGE_KEY_USER);
    const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(STORAGE_KEY_USER,  JSON.stringify(data.user));
      localStorage.setItem(STORAGE_KEY_TOKEN, data.token);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

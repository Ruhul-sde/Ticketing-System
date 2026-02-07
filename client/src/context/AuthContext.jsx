import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Setup axios interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://0.0.0.0:5000/api';

  useEffect(() => {
    if (!import.meta.env.VITE_API_URL) {
      console.warn('⚠️ VITE_API_URL not set, using default:', API_URL);
    }
  }, []);

  // Set axios default timeout and base URL
  axios.defaults.timeout = 10000;
  axios.defaults.baseURL = API_URL;

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    console.log('Auth check - Token exists:', !!token);
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('/auth/me');
      console.log('Auth check successful:', response.data.user.email);
      setUser(response.data.user);
    } catch (error) {
      console.error("Authentication check failed:", error.response?.status || error.message);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      
      const response = await axios.post('/auth/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      console.log('Login successful, token stored');
      
      // IMPORTANT: Update axios headers immediately
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Update user state immediately with response data
      setUser(response.data.user);
      console.log('User state updated:', response.data.user.email);
      
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        throw new Error('Cannot connect to server. Please check if the server is running.');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear local state regardless of API call
      console.log('Clearing auth state...');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  };

  const register = async (userData) => {
    await axios.post('/auth/register', userData);
  };

  // Keep-alive ping (optional, can be removed if causing issues)
  useEffect(() => {
    const keepAlive = setInterval(async () => {
      if (user) {
        try {
          await axios.get(`${API_URL.replace('/api', '')}/ping`);
        } catch (error) {
          console.debug('Keep-alive ping failed:', error.message);
        }
      }
    }, 30000);

    return () => clearInterval(keepAlive);
  }, [user, API_URL]);

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    API_URL,
    checkAuth // Export checkAuth if needed elsewhere
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
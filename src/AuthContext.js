import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      const userResponse = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${response.data.token}` }
      });

      setUser(userResponse.data.user);

      // Check if the user needs to change their password
      if (userResponse.data.user.hastochange === 1) {
        return '/change-password';
      }

      return '/user';
    } catch (error) {
      return null;
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    return '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

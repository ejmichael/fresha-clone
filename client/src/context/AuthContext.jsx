import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe, loginBusiness } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [business, setBusiness] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('saas_token') || null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setToken(null);
    setBusiness(null);
    localStorage.removeItem('saas_token');
  };

  const login = async (email, password) => {
    const { data } = await loginBusiness(email, password);
    setToken(data.token);
    setBusiness(data.business);
    localStorage.setItem('saas_token', data.token);
  };

  const setAuthData = (newToken, businessData) => {
    setToken(newToken);
    setBusiness(businessData);
    localStorage.setItem('saas_token', newToken);
  };

  useEffect(() => {
    const hydrateSession = async () => {
      if (token) {
        try {
          const { data } = await getMe(token);
          setBusiness(data.business);
        } catch (err) {
          console.error('Session hydration failed:', err);
          logout();
        }
      }
      setLoading(false);
    };
    hydrateSession();
  }, [token]);

  return (
    <AuthContext.Provider value={{ business, token, loading, isAuthenticated: !!token, login, logout, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedTokens = JSON.parse(localStorage.getItem('tokens'));
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedTokens && storedUser) {
        try {
          await authService.verifyToken();
          setTokens(storedTokens);
          setUser(storedUser);
          setIsAuthenticated(true);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedTokens.access}`;
        } catch (error) {
          // Token verification failed, try to refresh
          try {
            const newTokens = await api.post('/auth/refresh/', { refresh: storedTokens.refresh });
            localStorage.setItem('tokens', JSON.stringify({ access: newTokens.data.access, refresh: storedTokens.refresh }));
            setTokens({ access: newTokens.data.access, refresh: storedTokens.refresh });
            setUser(storedUser); // User data is still valid
            setIsAuthenticated(true);
            api.defaults.headers.common['Authorization'] = `Bearer ${newTokens.data.access}`;
          } catch (refreshError) {
            // Refresh also failed, logout
            authService.logout();
            setUser(null);
            setTokens(null);
            setIsAuthenticated(false);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
    setTokens(userData.tokens);
    setIsAuthenticated(true);
    api.defaults.headers.common['Authorization'] = `Bearer ${userData.tokens.access}`;
    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setTokens(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
  };

  const authContextValue = {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

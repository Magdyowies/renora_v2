import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem("access_token");
        }
      } catch {
        localStorage.removeItem("access_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login/", { email, password });
    const { access, refresh } = res.data.tokens;

    const decoded = jwtDecode(access);
    if (decoded.role !== 'admin' && decoded.role !== 'vendor') {
      throw new Error("You do not have permission to access the admin dashboard.");
    }

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    setUser(decoded);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  // 🔑 KEY CHANGE
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isVendor = user?.role === 'vendor';

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, isAdmin, isVendor, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

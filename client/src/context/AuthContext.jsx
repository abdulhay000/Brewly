import { createContext, useEffect, useState } from "react";
import { api, getToken } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("brewly_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("brewly_user");
      }
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("brewly_user", JSON.stringify(user));
    else localStorage.removeItem("brewly_user");
  }, [user]);

  const login = async (identifier, password) => {
    setIsSubmitting(true);
    setError("");
    try {
      const result = await api.login({ identifier, password });
      localStorage.setItem("brewly_token", result.token);
      setUser(result.user);
      return result.user;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const signup = async (email, username, password) => {
    setIsSubmitting(true);
    setError("");
    try {
      const result = await api.signup({ email, username, password });
      localStorage.setItem("brewly_token", result.token);
      setUser(result.user);
      return result.user;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("brewly_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, error, isSubmitting, token: getToken() }}
    >
      {children}
    </AuthContext.Provider>
  );
}

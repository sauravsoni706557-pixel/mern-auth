import { createContext, useContext, useEffect, useRef, useState } from "react";
import api, { registerTokenGetters } from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Access token ko ref mein rakhte hain (state ki jagah) taaki axios interceptor
  // ko hamesha latest value turant mile, bina extra re-render ke
  const accessTokenRef = useRef(null);

  const setAccessToken = (token) => {
    accessTokenRef.current = token;
  };

  useEffect(() => {
    // axios.js ko batao ki token kaha se milega aur kaha set hoga
    registerTokenGetters(() => accessTokenRef.current, setAccessToken);
  }, []);

  useEffect(() => {
    // Page refresh hone par, cookie ke bharose naya access token maango
    // (isse user ko baar baar login nahi karna padta)
    const tryRefresh = async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
        const meRes = await api.get("/auth/me");
        setUser(meRes.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const signup = async (name, email, password) => {
    await api.post("/auth/signup", { name, email, password });
    // signup ke baad seedha login kara dete hain
    await login(email, password);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

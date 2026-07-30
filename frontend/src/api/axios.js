import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // refresh token httpOnly cookie automatically bhejne ke liye zaroori
});

// Ye function AuthContext se set hoga taaki axios ke pass hamesha latest access token ho
let getAccessToken = () => null;
let setAccessTokenGlobal = () => {};

export const registerTokenGetters = (getter, setter) => {
  getAccessToken = getter;
  setAccessTokenGlobal = setter;
};

// Har request ke saath access token Authorization header mein daal do
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agar response 403 (access token expired) aaye, toh automatically refresh karke
// original request ko dobara try karo - user ko pata bhi nahi chalega
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // infinite loop se bachne ke liye
      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        setAccessTokenGlobal(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest); // original request ko naye token ke saath dobara chalao
      } catch (refreshError) {
        setAccessTokenGlobal(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

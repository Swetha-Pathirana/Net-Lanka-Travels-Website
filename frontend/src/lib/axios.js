import axios from "axios";
import { toast } from "react-toastify";

const API_URL =
  process.env.REACT_APP_NODE_ENV === "development"
    ? process.env.REACT_APP_DEVELOPMENT_API_URL
    : process.env.REACT_APP_PRODUCTION_API_URL;

export const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST =================
axiosInstance.interceptors.request.use(
  (config) => {
    const role = sessionStorage.getItem("role");

    let token = null;

    if (role === "admin") {
      token = sessionStorage.getItem("adminToken");
    }

    if (role === "superadmin") {
      token = sessionStorage.getItem("superadminToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE =================
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      toast.error("Session expired. Please login again.");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

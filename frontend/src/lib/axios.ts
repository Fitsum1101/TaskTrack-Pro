import { ACCESS_TOKEN } from "@/constant/variables";
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
  // 👉 If request contains FormData, set multipart header
  if (config.data instanceof FormData) {
    config.headers?.set("Content-Type", "multipart/form-data");
  } else {
    config.headers?.set("Content-Type", "application/json");
    config.headers?.set("Accept", "application/json");
  }
  // add token to header
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    config.headers?.set("Authorization", `Bearer ${token}`);
  }
  // Do something before request is sent
  return config;
});

axiosInstance.interceptors.response.use(undefined, async (error) => {
  if (error.response?.status === 401) {
    await refreshToken();
    return axiosInstance(error.config);
  }

  throw error;
});
// Refresh token logic
const refreshToken = async () => {
  // Perform refresh token logic here
};

export default axiosInstance;

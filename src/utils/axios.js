import axios from "axios";
import { useAuthStore } from "@/Store/auth.store";
const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});
instance.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const auth = useAuthStore();
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await auth.refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch {
        auth.logout();
      }
    }

    return Promise.reject(err);
  }
);
export default instance;

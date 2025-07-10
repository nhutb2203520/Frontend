import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000", // hoặc thay đổi thành domain thật nếu cần
  timeout: 10000,
});

// Intercept request: tự động thêm Authorization từ sessionStorage
instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("adminToken")?.replace(/"/g, "");


    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Gửi token admin:", token); // ❗ Có thể tắt log này khi đưa vào production
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept response: nếu cần xử lý lỗi chung cho admin (tùy)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("❌ Token không hợp lệ hoặc đã hết hạn.");
      // Có thể tự redirect về trang đăng nhập nếu muốn
      // window.location.href = "/admin/signin";
    }

    return Promise.reject(error);
  }
);

export default instance;

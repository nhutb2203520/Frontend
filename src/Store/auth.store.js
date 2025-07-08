import { defineStore } from "pinia";
import axios from "@/utils/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: sessionStorage.getItem("accessToken") || "",
    refreshToken: sessionStorage.getItem("refreshToken") || "",
    refreshInterval: null,
  }),
  actions: {
    setTokens(access, refresh) {
      this.accessToken = access;
      this.refreshToken = refresh;
      sessionStorage.setItem("accessToken", access);
      sessionStorage.setItem("refreshToken", refresh);
    },

    async refreshAccessToken() {
      const res = await axios.post("/readers/refresh-token", {
        refreshToken: this.refreshToken,
      });

      this.setTokens(res.data.token, this.refreshToken);

      // ✅ Trả token mới về để interceptor dùng tiếp
      return res.data.token;
    },

    logout() {
      this.accessToken = "";
      this.refreshToken = "";
      sessionStorage.clear();
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
      window.location.href = "/";
    },

    // Auto refresh mỗi 25s
    startRefreshLoop() {
      if (this.refreshInterval) clearInterval(this.refreshInterval);

      console.log("🚀 Bắt đầu vòng lặp refresh token"); // ✅ Debug
      this.refreshInterval = setInterval(async () => {
        try {
          console.log("🔁 Đang tự động refresh token..."); // ✅ Debug
          const newToken = await this.refreshAccessToken();
          console.log("✅ Token mới:", newToken);
        } catch (err) {
          console.error("❌ Refresh thất bại:", err);
          this.logout();
        }
      }, 25000);
    },
  },
});

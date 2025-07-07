import { defineStore } from "pinia";
import axios from "@/utils/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("accessToken") || "",
    refreshToken: localStorage.getItem("refreshToken") || "",
  }),
  actions: {
    setTokens(access, refresh) {
      this.accessToken = access;
      this.refreshToken = refresh;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    },

    async refreshAccessToken() {
      const res = await axios.post("/auth/refresh-token", {
        refreshToken: this.refreshToken,
      });
      this.setTokens(res.data.token, this.refreshToken);
      return res.data.token;
    },

    logout() {
      this.accessToken = "";
      this.refreshToken = "";
      localStorage.clear();
      window.location.href = "/";
    },
  },
});

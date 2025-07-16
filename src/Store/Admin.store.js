// src/Store/admin.store.js
import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { useAuthStore } from "./auth.store";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    adminInfo: sessionStorage.getItem("adminInfo") || "",
  }),

  actions: {
    login(data) {
      return axios
        .post("/staffs/login", data)
        .then((response) => {
          if (response.data && response.data.nhanvien) {
            const hoTen = response.data.nhanvien.HoTenNV;
            this.adminInfo = hoTen; // Gán vào state Pinia
            const authStore = useAuthStore();
            sessionStorage.setItem("adminInfo", hoTen);
            authStore.setTokens(
              response.data.token,
              response.data.refreshToken
            );
            authStore.startRefreshLoop();
          }
          return response.data;
        })
        .catch((error) => {
          throw new Error(error.response?.data?.message || error.message);
        });
    },
    getMyAccount() {
      return axios
        .get("/staffs/me")
        .then((res) => {
          return res.data.nhanvien;
        })
        .catch((error) => {
          throw new Error(error.response?.data?.message || error.message);
        });
    },
    updateAccount(data) {
      return axios
        .patch("/staffs/me", data)
        .then((res) => {
          if (res.data.nhanvien) {
            const updatedStaff = res.data.nhanvien;
            this.adminInfo = updatedStaff.HoTenNV;
            sessionStorage.setItem("adminInfo", updatedStaff.HoTenNV);
          }
          return res.data;
        })
        .catch((error) => {
          throw new Error(error.response?.data?.message || error.message);
        });
    },
    changePassword(data) {
      return axios
        .patch("/staffs/change-password", data)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          throw new Error(error.response?.data?.message || error.message);
        });
    },
    deleteMyAccount() {
      return axios
        .delete("/staffs/me")
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          throw new Error(error.response?.data?.message || error.message);
        });
    },
  },
});

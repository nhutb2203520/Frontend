// /d:/Frontend-register-borrow-book/Frontend/src/Store/Reader.store.js
import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { useAuthStore } from "./auth.store";
export const useReaderStore = defineStore("reader", {
  state: () => ({
    readers: [],
    infoReader: sessionStorage.getItem("infoReader") || " ",
    selectedReader: null,
    loading: false,
    error: null,
  }),
  actions: {
    setInfoReader(hoTen) {
      this.infoReader = hoTen;
      sessionStorage.setItem("infoReader", hoTen);
    },
    setReaders(readers) {
      this.readers = readers;
    },
    setSelectedReader(reader) {
      this.selectedReader = reader;
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setError(error) {
      this.error = error;
    },
    login(data) {
      return axios
        .post("/readers/login", data)
        .then((response) => {
          if (response.data && response.data.reader) {
            const hoTen = response.data.reader.HoTen;
            this.infoReader = hoTen; // Gán vào state Pinia
            const authStore = useAuthStore();
            sessionStorage.setItem("infoReader", hoTen);
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
    register(data) {
      return axios
        .post("/readers/register", data)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw new Error(error.response?.data?.message || error.message);
        });
    },
    forgotPassword(identifier) {
      return axios
        .post("/auth/forgot-password", identifier)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Không thể gửi yêu cầu khôi phục mật khẩu.";
          throw new Error(errorMessage);
        });
    },
    resetPassword({ token, Password }) {
      return axios
        .post(`/auth/reset-password/${token}`, { Password })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Không thể đặt lại mật khẩu.";
          throw new Error(errorMessage);
        });
    },
    getMyAccount() {
      return axios
        .get("/readers/me")
        .then((response) => {
          return response.data.reader;
        })
        .catch((error) => {
          throw new Error(error.response?.data?.message || error.message);
        });
    },
    async changePassword(currentPassword, newPassword) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.patch("/readers/change-password", {
          currentPassword,
          newPassword,
        });
        return response.data;
      } catch (err) {
        this.setError(err.response?.data?.message || err.message);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },
    updateAccount(data) {
      return axios
        .patch("/readers/me", data)
        .then((response) => {
          if (response.data.reader) {
            const updatedReader = response.data.reader;
            this.infoReader = updatedReader.HoTen;
            sessionStorage.setItem("infoReader", updatedReader.HoTen);
          }

          return response.data;
        })
        .catch((error) => {
          throw new Error(error.response?.data?.message || error.message);
        });
    },
    deleteMyAccount() {
      return axios
        .delete("/readers/me")
        .then((response) => {
          if (response.data.deletedAccount) {
            this.infoReader = "";
            sessionStorage.removeItem("infoReader");
          }

          return response.data;
        })
        .catch((error) => {
          throw new Error(error.response?.data?.message || error.message);
        });
    },
    async fetchReaders() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get("/readers");
        if (response.data.danhsachdocgia) {
          this.setReaders(response.data.danhsachdocgia);
        }
        return response.data.danhsachdocgia;
      } catch (err) {
        this.setError(err.response?.data?.message || err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async updateStatus(data) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.patch(
          `/readers/update-status/${data._id}`,
          data
        );
        return response.data;
      } catch (err) {
        this.setError(err.response?.data?.message || err.message);
      } finally {
        this.setLoading(false);
      }
    },
  },
});

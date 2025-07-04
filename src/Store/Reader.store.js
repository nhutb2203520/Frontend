// /d:/Frontend-register-borrow-book/Frontend/src/Store/Reader.store.js
import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { useAuthStore } from "@/Store/auth.store";
export const useReaderStore = defineStore("reader", {
  state: () => ({
    readers: [],
    infoReader: localStorage.getItem("infoReader") || " ",
    selectedReader: null,
    loading: false,
    error: null,
  }),
  actions: {
    login(data) {
      return axios
        .post("/readers/login", data)
        .then((response) => {
          if (response.data && response.data.reader) {
            const hoTen = response.data.reader.HoTen;
            this.infoReader = hoTen; // Gán vào state Pinia
            localStorage.setItem("infoReader", hoTen);
            const authStore = useAuthStore();
            authStore.setTokens(
              response.data.token,
              response.data.refreshToken
            );
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
    forgotPassword(email) {
      return;
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
    async fetchReaders() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get("/readers");
        this.setReaders(response.data);
      } catch (err) {
        this.setError(err.response?.data?.message || err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async addReader(reader) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.post("/api/readers", reader);
        this.readers.push(response.data);
      } catch (err) {
        this.setError(err.response?.data?.message || err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async updateReader(reader) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.put(`/api/readers/${reader.id}`, reader);
        const updatedReader = response.data;
        this.readers = this.readers.map((r) =>
          r.id === updatedReader.id ? updatedReader : r
        );
      } catch (err) {
        this.setError(err.response?.data?.message || err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteReader(id) {
      this.setLoading(true);
      this.setError(null);
      try {
        await axios.delete(`/api/readers/${id}`);
        this.readers = this.readers.filter((r) => r.id !== id);
      } catch (err) {
        this.setError(err.response?.data?.message || err.message);
      } finally {
        this.setLoading(false);
      }
    },
  },
});

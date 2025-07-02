// /d:/Frontend-register-borrow-book/Frontend/src/Store/Reader.store.js
import { defineStore } from "pinia";
import axios from "axios";

export const useReaderStore = defineStore("reader", {
  state: () => ({
    readers: [],
    selectedReader: null,
    loading: false,
    error: null,
  }),
  actions: {
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

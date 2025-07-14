import { defineStore } from "pinia";
import api from "../utils/axios";
import { useAuthStore } from "./auth.store";
export const useBorrowBookStore = defineStore("borrowBook", {
  state: () => ({
    borrowBooks: [],
    loading: false,
    error: null,
  }),
  actions: {
    setBorrowBooks(borrowBooks) {
      this.borrowBooks = borrowBooks;
    },
    addBorrowBook(borrowBook) {
      this.borrowBooks.push(borrowBook);
    },
    removeBorrowBook(id) {
      this.borrowBooks = this.borrowBooks.filter((book) => book.id !== id);
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setError(error) {
      this.error = error;
    },
    async fetchBorrowBooksForUser() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await api.get("/borrows");
        if (response.data.danhsachmuon) {
          this.setBorrowBooks(response.data.danhsachmuon);
        }
        return response.data.danhsachmuon;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async registerBorrowBook(MaSach) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await api.post(`/borrows/${MaSach}`);
        if (response.data.phieumuon) {
          if (!Array.isArray(this.borrowBooks)) {
            this.borrowBooks = []; // Khởi tạo lại nếu bị undefined
          }
          this.borrowBooks.push(response.data.phieumuon);
        }

        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async cancelBorrowBook(MaMuonSach) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await api.delete(`/borrows/${MaMuonSach}`);
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async extendBorrowBook(MaMuonSach) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await api.patch(`/borrows/extend/${MaMuonSach}`);
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async fetchBorrowBooksForAdmin() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await api.get("/borrows/admin");
        if (response.data.danhsachmuon) {
          this.setBorrowBooks(response.data.danhsachmuon);
        }
        return response.data.danhsachmuon;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async updateBorrowBook(data) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await api.patch(`/borrows/${data.MaMuonSach}`, data);
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async fetchBorrowBookDeadline() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await api.get(`/borrows/borrows-deadline`);
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async sendEmailRemind(MaMuonSach) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await api.post(
          `/borrows/send-email-remind/${MaMuonSach}`
        );
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
  },
});

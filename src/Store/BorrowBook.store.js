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
    async fetchBorrowBooks() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await api.get("/borrows");
        this.setBorrowBooks(response.data.danhsachmuon);
        console.log("DANH SÁCH MƯỢN:", response.data.danhsachmuon); // Debug
        return response.data.danhsachmuon;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
  },
});

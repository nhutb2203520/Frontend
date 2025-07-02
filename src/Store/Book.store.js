// /d:/Frontend-register-borrow-book/Frontend/src/Store/Book.store.js
import { defineStore } from "pinia";
import axios from "../utils/axios";

export const useBookStore = defineStore("book", {
  state: () => ({
    books: [],
    loading: false,
    error: null,
  }),
  actions: {
    setBooks(books) {
      this.books = books;
    },
    addBook(book) {
      this.books.push(book);
    },
    removeBook(id) {
      this.books = this.books.filter((book) => book.id !== id);
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setError(error) {
      this.error = error;
    },
    async fetchBooks() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get("/books");
        this.setBooks(response.data.danhsachsach);
        return response.data.danhsachsach;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async fetchBooksHot() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get("/books/hot");
        this.setBooks(response.data.danhsachsach);
        return response.data.danhsachsach;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async fetchBooksNew() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get("/books/new");
        this.setBooks(response.data.danhsachsach);
        return response.data.danhsachsach;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async fetchBookByMaSach(MaSach) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get(`/books/${MaSach}`);
        return response.data.sach;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
  },
});

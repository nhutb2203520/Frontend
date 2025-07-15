import { defineStore } from "pinia";
import axios from "@/utils/axios";
export const useAuthorStore = defineStore("author", {
  state: () => ({
    authors: [],
    loading: false,
    error: null,
  }),
  actions: {
    setAuthors(authors) {
      this.authors = authors;
    },
    addAuthor(author) {
      this.authors.push(author);
    },
    removeAuthor(id) {
      this.authors = this.authors.filter((author) => author.id !== id);
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setError(error) {
      this.error = error;
    },
    async fetchAuthors() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get("/authors");
        this.setAuthors(response.data.danhsachtacgia);
        return response.data.danhsachtacgia;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async addOneAuthor(data) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.post("/authors", data);
        if (response.data.tacgia) {
          if (!Array.isArray(this.authors)) this.authors = [];
          this.addAuthor(response.data.tacgia);
        }
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async updateAuthor(data) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.patch(`/authors/${data._id}`, data);
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteAuthor(id) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.delete(`/authors/${id}`);
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
  },
});

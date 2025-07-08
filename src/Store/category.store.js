import { defineStore } from "pinia";
import axios from "@/utils/axios";
export const useCategoryBookStore = defineStore("categoryBook", {
  state: () => ({
    categorys: [],
  }),
  actions: {
    setCategoryBooks(categorys) {
      this.categorys = categorys;
    },
    addCategoryBook(category) {
      this.categorys.push(category);
    },
    async fetchCategoryBooks() {
      try {
        const response = await axios.get("/categorys");
        this.setCategoryBooks(response.data.danhsachloaisach);
        return response.data.danhsachloaisach;
      } catch (err) {
        console.log(err.message);
      }
    },
  },
});

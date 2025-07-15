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
        if (response.data.danhsachloaisach) {
          if (!Array.isArray(this.categorys)) this.categorys = [];
          this.setCategoryBooks(response.data.danhsachloaisach);
        }

        return response.data.danhsachloaisach;
      } catch (err) {
        console.log(err.message);
      }
    },
    async addCategoryBook(data) {
      try {
        const response = await axios.post("/categorys", data);
        if (response.data.loaisach) {
          this.categorys.push(response.data.loaisach);
        }
        return response.data;
      } catch (err) {
        console.log(err.message);
      }
    },
    async updateCategoryBook(data) {
      try {
        const response = await axios.patch(`/categorys/${data.MaLoai}`, data);
        return response.data;
      } catch (err) {
        console.log(err.message);
      }
    },
    async deleteCategoryBook(MaLoai) {
      try {
        const response = await axios.delete(`/categorys/${MaLoai}`);
        return response.data;
      } catch (err) {
        console.log(err.message);
      }
    },
  },
});

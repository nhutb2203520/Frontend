import { defineStore } from "pinia";
import axios from "@/utils/axios";
export const useLocationStore = defineStore("location", {
  state: () => ({
    locations: [],
  }),
  actions: {
    setLocationBooks(locations) {
      this.locations = locations;
    },
    addLocationBook(location) {
      this.locations.push(location);
    },
    async fetchLocationBooks() {
      try {
        const response = await axios.get("/positions");
        this.setLocationBooks(response.data.danhsachvitri);
        return response.data.danhsachvitri;
      } catch (err) {
        console.log(err.message);
      }
    },
    async addLocationBook(data) {
      try {
        const response = await axios.post("/positions", data);
        if (response.data.vitri) {
          this.addLocationBook(response.data.vitri);
          return response.data.vitri; // ✅ Trả về đối tượng vitri đúng định dạng
        } else {
          return { error: response.data.message };
        }
      } catch (err) {
        console.log(err.message);
        return { error: err.message };
      }
    },

    async updateLocationBook(data) {
      try {
        const response = await axios.patch(`/positions/${data.MaViTri}`, data);
        return response.data;
      } catch (err) {
        console.log(err.message);
      }
    },
    async deleteLocationBook(MaViTri) {
      try {
        const response = await axios.delete(`/positions/${MaViTri}`);
        return response.data;
      } catch (err) {
        console.log(err.message);
      }
    },
  },
});

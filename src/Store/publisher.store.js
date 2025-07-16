import { defineStore } from "pinia";
import axios from "@/utils/axios";
export const usePublisherStore = defineStore("publisher", {
  state: () => ({
    publishers: [],
    loading: false,
    error: null,
  }),
  actions: {
    setPublishers(publishers) {
      this.publishers = publishers;
    },
    addPublisher(publisher) {
      this.publishers.push(publisher);
    },
    removePublisher(id) {
      this.publishers = this.publishers.filter(
        (publisher) => publisher.id !== id
      );
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setError(error) {
      this.error = error;
    },
    async fetchPublishers() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get("/publishers");
        this.setPublishers(response.data.danhsachNXB);
        return response.data.danhsachNXB;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async addOnePublisher(data) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.post("/publishers", data);
        if (response.data.nxb) {
          if (!Array.isArray(this.publishers)) this.publishers = [];
          this.addPublisher(response.data.nxb);
        }
        
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async update(data) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.patch(`/publishers/${data.MaNXB}`, data);
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async deletePublisher(MaNXB) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.delete(`/publishers/${MaNXB}`);
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
  },
});

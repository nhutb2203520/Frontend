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
  },
});

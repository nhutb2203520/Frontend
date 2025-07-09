// src/Store/search.store.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
  const keyword = ref("");
  function setKeyword(k) {
    keyword.value = k;
  }
  return { keyword, setKeyword };
});

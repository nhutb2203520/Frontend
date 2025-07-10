import { defineStore } from "pinia";

export const useSearchFilterStore = defineStore("searchFilter", {
  state: () => ({
    searchKeyword: "",
    selectedAuthor: null,
    selectedGenre: null,
    selectedPublisher: null,
    selectedYear: null,
  }),
  actions: {
    setAuthor(author) {
      this.selectedAuthor = author;
      this.clearOthers("author");
    },
    setGenre(genre) {
      this.selectedGenre = genre;
      this.clearOthers("genre");
    },
    setPublisher(publisher) {
      this.selectedPublisher = publisher;
      this.clearOthers("publisher");
    },
    setYear(year) {
      this.selectedYear = year;
      this.clearOthers("year");
    },
    setSearchKeyword(keyword) {
      this.searchKeyword = keyword;
      this.clearAllExcept("searchKeyword");
    },
    clearAll() {
      this.searchKeyword = "";
      this.selectedAuthor = null;
      this.selectedGenre = null;
      this.selectedPublisher = null;
      this.selectedYear = null;
    },
    clearOthers(field) {
      if (field !== "author") this.selectedAuthor = null;
      if (field !== "genre") this.selectedGenre = null;
      if (field !== "publisher") this.selectedPublisher = null;
      if (field !== "year") this.selectedYear = null;
      this.searchKeyword = "";
    },
    clearAllExcept(field) {
      const keys = [
        "searchKeyword",
        "selectedAuthor",
        "selectedGenre",
        "selectedPublisher",
        "selectedYear",
      ];
      keys.forEach((k) => {
        if (k !== field) this[k] = k === "searchKeyword" ? "" : null;
      });
    },
  },
});

// src/stores/callStore.js
import { defineStore } from "pinia";

export const useCallStore = defineStore("call", {
  state: () => ({
    isAnswered: false,
  }),
  actions: {
    answerHandler() {
      this.isAnswered = !this.isAnswered;
      console.log("answered", this.isAnswered);
    },
  },
});

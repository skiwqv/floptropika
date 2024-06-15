import apiClient from "@/api";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    currentUser: null,
  }),
  getters: {
    getUser: (state) => state.currentUser,
  },
  actions: {
    async signIn(user) {
      try {
        const response = await apiClient.post("/users/login/", user);
        if (response.status === 200) {
          this.currentUser = response.data;
          document.cookie = `token=${this.currentUser.token.access}; path=/;`;
        }
        return response;
      } catch (error) {
        console.error("Login failed", error);
      }
    },
  },
});

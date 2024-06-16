import apiClient from "@/api";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    currentUser: null,
    token: document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1],
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
          document.cookie = `token=${response.data.token};Secure;max-age=3600`;
        }
        return response;
      } catch (error) {
        console.error("Login failed", error);
      }
    },
  },
});

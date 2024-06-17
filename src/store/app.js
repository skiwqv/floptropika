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
        const response = await apiClient.post("/api/login/", user);
        if (response.status === 200) {
          console.log("resp", response);
          const getToken = await apiClient.post("/api/token/", user);
          const refreshToken = await apiClient.post(
            "/api/token/refresh/",
            getToken.data
          );
          document.cookie = `accessToken=${refreshToken.data.access};Secure;max-age=3600;`;
          document.cookie = `refreshToken=${getToken.data.refresh};Secure;max-age=3600;`;
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.access}`;
          this.currentUser = response.data.user;
        }
        return response;
      } catch (error) {
        console.error("Login failed", error);
      }
    },
    async register(user) {
      try {
        const response = await apiClient.post("/api/register/", user);
        return response;
      } catch (error) {
        console.error("registration failed", error);
      }
    },
    async getCurrentUser() {
      try {
        const response = await apiClient.get("/api/me/");
        this.currentUser = response.data;
        return response.data;
      } catch (error) {
        console.error("Fetching current user failed", error);
      }
    },
  },
});

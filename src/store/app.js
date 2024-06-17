import apiClient from "@/api";
import { defineStore } from "pinia";
import delete_cookie from "@/utils/utils.js";

export const useAppStore = defineStore("app", {
  state: () => ({
    currentUser: null,
    accessToken: document.cookie
      .split("; ")
      .find((row) => row.startsWith("access="))
      ?.split("=")[1],
    refreshToken: "",
    legends: null,
  }),
  getters: {
    getUser: (state) => state.currentUser,
    getAllLegends: (state) => state.legends,
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
          this.refreshToken = getToken.data.refresh;
          document.cookie = `access=${refreshToken.data.access};Secure;max-age=86400;`;
          document.cookie = `refresh=${getToken.data.refresh};Secure;max-age=86400;`;
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
      if (this.accessToken) {
        try {
          const response = await apiClient.get("/api/me/");
          this.currentUser = response.data;
          return response.data;
        } catch (error) {
          console.error("Fetching current user failed", error);
        }
      }
    },
    async logout() {
      const refreshToken = {
        refresh: this.refreshToken,
      };
      console.log("refresh logout", refreshToken);
      try {
        await apiClient.post("/api/logout/", refreshToken);
        this.currentUser = "";
        delete_cookie("access");
        delete_cookie("refresh");
        return true;
      } catch (error) {
        throw error.response.data;
      }
    },
    async postLegend(legend) {
      console.log(legend);
      const flopusa = await apiClient.post("/flop/create/", legend);
      console.log(flopusa.data);
    },
    async getLegends() {
      const flopusa = await apiClient.get("/flop/all/");
      this.legends = flopusa.data;
      console.log("store legends", this.legends);
      return flopusa;
    },
  },
});

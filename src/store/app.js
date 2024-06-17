import apiClient from "@/api";
import { defineStore } from "pinia";
import delete_cookie from "@/utils/utils.js";

export const useAppStore = defineStore("app", {
  state: () => ({
    currentUser: null,
    accessToken:
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("access="))
        ?.split("=")[1] || "",
    refreshToken:
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("refresh="))
        ?.split("=")[1] || "",
    legends: null,
    isLoading: false,
  }),
  getters: {
    getUser: (state) => state.currentUser,
    getAllLegends: (state) => state.legends,
  },
  actions: {
    async signIn(user) {
      this.isLoading = true;
      try {
        const response = await apiClient.post("/api/login/", user);
        if (response.status === 200) {
          const getToken = await apiClient.post("/api/token/", user);
          const refreshToken = await apiClient.post(
            "/api/token/refresh/",
            getToken.data
          );
          this.accessToken = refreshToken.data.access;
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
      } finally {
        this.isLoading = false;
      }
    },
    async register(user) {
      this.isLoading = true;
      try {
        const response = await apiClient.post("/api/register/", user);
        return response;
      } catch (error) {
        console.error("registration failed", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getCurrentUser() {
      if (this.accessToken) {
        this.isLoading = true;
        try {
          const response = await apiClient.get("/api/me/");
          this.currentUser = response.data;
          return response.data;
        } catch (error) {
          console.error("Fetching current user failed", error);
        } finally {
          this.isLoading = false;
        }
      }
    },
    async logout() {
      const refreshToken =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("refresh="))
          ?.split("=")[1] || "";
      this.isLoading = true;
      try {
        await apiClient.post("/api/logout/", { refresh: refreshToken });
        this.currentUser = "";
        this.accessToken = "";
        this.refreshToken = "";
        delete_cookie("access");
        delete_cookie("refresh");
        return true;
      } catch (error) {
        throw error.response.data;
      } finally {
        this.isLoading = false;
      }
    },
    async postLegend(legend) {
      this.isLoading = true;
      try {
        await apiClient.post("/flop/create/", legend);
      } finally {
        this.isLoading = false;
      }
    },
    async getLegends() {
      this.isLoading = true;
      try {
        const flopusa = await apiClient.get("/flop/all/");
        this.legends = flopusa.data;
        return flopusa;
      } finally {
        this.isLoading = false;
      }
    },
  },
});

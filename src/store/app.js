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
    userById: null,
    websocket: null,
    messages: [], // добавить массив для хранения сообщений чата
  }),
  getters: {
    getUser: (state) => state.currentUser,
    getAllLegends: (state) => state.legends,
    profileUser: (state) => state.userById,
    chatMessages: (state) => state.messages, // добавить геттер для сообщений чата
  },
  actions: {
    async signIn(user) {
      this.isLoading = true;
      try {
        const audio = new Audio(require("@/assets/sounds/lipstick.mp3"));
        audio.play();
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
        const audio = new Audio(require("@/assets/sounds/jiafei-scream.mp3"));
        audio.play();
        console.error("Login failed", error);
      } finally {
        this.isLoading = false;
      }
    },
    async register(user) {
      this.isLoading = true;
      try {
        const audio = new Audio(require("@/assets/sounds/lipstick.mp3"));
        audio.play();
        const response = await apiClient.post("/api/register/", user);
        return response;
      } catch (error) {
        const audio = new Audio(require("@/assets/sounds/jiafei-scream.mp3"));
        audio.play();
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
        const audio = new Audio(require("@/assets/sounds/lipstick.mp3"));
        audio.play();
        await apiClient.post("/api/logout/", { refresh: refreshToken });
        this.currentUser = "";
        this.accessToken = "";
        this.refreshToken = "";
        delete_cookie("access");
        delete_cookie("refresh");
        return true;
      } catch (error) {
        const audio = new Audio(require("@/assets/sounds/jiafei-scream.mp3"));
        audio.play();
        throw error.response.data;
      } finally {
        this.isLoading = false;
      }
    },
    async postLegend(legend) {
      this.isLoading = true;
      try {
        const audio = new Audio(require("@/assets/sounds/lipstick.mp3"));
        audio.play();
        await apiClient.post("/flop/create/", legend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        const audio = new Audio(require("@/assets/sounds/jiafei-scream.mp3"));
        audio.play();
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
    async sendPhoto(user) {
      this.isLoading = true;
      try {
        const audio = new Audio(require("@/assets/sounds/lipstick.mp3"));
        audio.play();
        await apiClient.patch("/api/update/", user, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        const audio = new Audio(require("@/assets/sounds/jiafei-scream.mp3"));
        audio.play();
        console.error("Error:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getUserById(id) {
      this.isLoading = true;
      try {
        const flopusa = await apiClient.get(`/api/profile/${id}`);
        this.userById = flopusa.data;
        return flopusa;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteLegend(legend) {
      this.isLoading = true;
      try {
        const audio = new Audio(require("@/assets/sounds/lipstick.mp3"));
        audio.play();
        await apiClient.delete(`/flop/delete/${legend}/`, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        const audio = new Audio(require("@/assets/sounds/jiafei-scream.mp3"));
        audio.play();
      } finally {
        this.isLoading = false;
      }
    },
    async updateLegend(legend) {
      this.isLoading = true;
      try {
        console.log("store legend", legend);
        const audio = new Audio(require("@/assets/sounds/lipstick.mp3"));
        audio.play();
        await apiClient.patch(`/flop/update/${legend.id}/`, legend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        const audio = new Audio(require("@/assets/sounds/jiafei-scream.mp3"));
        audio.play();
      } finally {
        this.isLoading = false;
      }
    },
    // WebSocket actions
    initWebSocket(roomName) {
      this.websocket = new WebSocket(
        `wss://flopproject-1.onrender.com/ws/chat/${roomName}/`
      );
      this.websocket.onopen = () => {
        console.log("WebSocket connection opened");
      };

      this.websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.messages.push(message);
      };

      this.websocket.onclose = () => {
        console.log("WebSocket connection closed");
        this.websocket = null;
      };

      this.websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    },

    sendMessage(message) {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.send(
          JSON.stringify({
            message: message,
          })
        );
        this.messages.push(message);
      }
    },
    closeWebSocket() {
      if (this.websocket) {
        this.websocket.close();
      }
    },
  },
});

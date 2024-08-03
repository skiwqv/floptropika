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
    messages: [],
    isSound: false,
    resentChats: [],
  }),
  getters: {
    getUser: (state) => state.currentUser,
    getAllLegends: (state) => state.legends,
    profileUser: (state) => state.userById,
    chatMessages: (state) => state.messages,
    getSound: (state) => state.isSound,
    getResentChats: (state) => state.resentChats,
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
    async sendMusic(user) {
      this.isLoading = true;
      try {
        await apiClient.patch("/api/update/", user, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } finally {
        this.isLoading = false;
      }
    },
    async getUserById(id) {
      this.isLoading = true;
      try {
        const flopusa = await apiClient.get(`/api/profile/${id}`);
        sessionStorage.setItem("recipientId", id);
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
    initWebSocket(roomName, sender, res) {
      this.websocket = new WebSocket(
        `wss://flopproject-1.onrender.com/ws/chat/${roomName}/?token=${this.accessToken}`
      );

      this.websocket.onopen = () => {
        if (sender) {
          const getUsersMessage = JSON.stringify({
            type: "get_users",
            sender: sender.username,
            recipient: res.username,
          });
          const markAsReadMessage = JSON.stringify({
            type: "mark_as_read",
            sender: sender.username,
            recipient: res.username,
          });

          this.websocket.send(getUsersMessage);

          this.websocket.send(markAsReadMessage);
        }
      };

      this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.message) {
          this.messages.push({
            message: data.message,
            sender: data.sender,
            recipient: data.recipient,
            avatar: data.avatar,
            isRead: data.is_read,
          });

          if (data.sender !== this.currentUser.username) {
            const markAsReadIncomingMessage = JSON.stringify({
              type: "mark_as_read",
              sender: this.currentUser.username,
              recipient: res.username,
            });

            this.websocket.send(markAsReadIncomingMessage);
          }
        } else if (data.type === "messages_marked_as_read") {
          this.messages.forEach((msg) => {
            if (
              msg.sender === data.sender &&
              msg.recipient === data.recipient
            ) {
              msg.isRead = data.is_read;
            }
          });
        }
      };

      this.websocket.onerror = () => {};

      this.websocket.onclose = () => {};
    },
    sendMessage(message) {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        const audio = new Audio(require("@/assets/sounds/notif.mp3"));
        audio.play();
        this.websocket.send(
          JSON.stringify({
            type: "chat_message",
            message: message.content,
            sender: message.sender.username,
            recipient: message.recipient.username,
          })
        );
      }
    },
    sendCallRequest(message) {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.send(
          JSON.stringify({
            type: "call_notification",
            sender: message.sender.username,
            recipient: message.recipient.username,
          })
        );
      }
    },
    closeWebSocket() {
      if (this.websocket) {
        this.websocket.close();
      }
    },
    soundHandler() {
      this.isSound = !this.isSound;
    },
    async setRessentChats() {
      this.isLoading = true;
      try {
        const res = await apiClient.get("/chat/users_chat/");
        this.resentChats = res.data;
      } finally {
        this.isLoading = false;
      }
    },
  },
});

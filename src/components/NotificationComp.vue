<template>
  <div
    v-for="notification in notifications"
    :key="notification"
    class="notifications"
    @click="toChat(notification)"
  >
    <transition-group name="fade" tag="div" class="notifications__list">
      <div class="notification">
        <div class="notification__header">
          <!-- <img
            :src="
              notification.avatar
                ? notification.avatar
                : require('../assets/images/placeholder.png')
            "
            alt="User Avatar"
            class="notification__avatar"
          /> -->
          <span class="notification__username">{{ notification.sender }}</span>
        </div>
        <div class="notification__body">
          <p>{{ notification.message }}</p>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useAppStore } from "@/store/app.js";
import router from "@/router";

const appStore = useAppStore();
const currentUser = computed(() => appStore.getUser);
const notifications = ref([]);

const addNotification = (notification) => {
  notifications.value.push(notification);
  setTimeout(() => {
    const audio = new Audio(require("@/assets/sounds/poosay.mp3"));
    audio.play();
    notifications.value.shift();
  }, 3000);
};

let websocket;

const initWebSocket = () => {
  websocket = new WebSocket(
    `wss://flopproject-1.onrender.com/ws/notification/?token=${appStore.accessToken}`
  );

  websocket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("socket data", JSON.parse(event.data));
    addNotification(data);
  };

  websocket.onclose = (event) => {
    console.log("WebSocket connection closed:", event);
    websocket = null;
  };

  websocket.onerror = (event) => {
    console.error("WebSocket error:", event);
  };
};

const toChat = (id) => {
  router.push(`/room/${currentUser.value.id + id.id}`);
};

onMounted(() => {
  initWebSocket();
});

onBeforeUnmount(() => {
  if (websocket) {
    websocket.close();
  }
});
</script>

<style scoped>
.notifications {
  position: fixed;
  cursor: pointer;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 999;
}

.notifications__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 300px;
  transition: opacity 0.5s ease;
}

.notification__header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.notification__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.notification__username {
  color: #000;
  font-weight: bold;
  font-size: 16px;
}

.notification__body {
  font-size: 14px;
}

@media (max-width: 600px) {
  .notification {
    width: 250px;
  }

  .notification__username {
    color: #000;
    font-size: 14px;
  }

  .notification__body {
    font-size: 12px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

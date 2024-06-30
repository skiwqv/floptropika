<template>
  <div class="notifications">
    <transition-group name="fade" tag="div" class="notifications__list">
      <div
        v-for="notification in notifications"
        :key="notification"
        class="notification"
        @click="toChat(notification)"
      >
        <div class="notification__header">
          <img
            :src="
              notification.sender_avatar
                ? notification.sender_avatar
                : require('../assets/images/placeholder.png')
            "
            alt="User Avatar"
            class="notification__avatar"
          />
          <span class="notification__username">{{
            notification.sender_username
          }}</span>
        </div>
        <div class="notification__body">
          <p>{{ notification.notification }}</p>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useAppStore } from "@/store/app.js";
import { useRoute } from "vue-router";
import router from "@/router";

const appStore = useAppStore();
const currentUser = computed(() => appStore.getUser);
const notifications = ref([]);
const lastNotification = ref(null);

const getSound = computed(() => appStore.getSound);
const route = useRoute();

const addNotification = (notification) => {
  if (route.path.startsWith("/room")) {
    return;
  }

  if (lastNotification.value !== notification) {
    notifications.value.unshift(notification);
    const audio = new Audio(require("@/assets/sounds/poosay.mp3"));
    if (getSound.value == true) {
      audio.play();
    } else {
      audio.muted;
    }
    console.log(notification);
    setTimeout(() => {
      notifications.value.pop();
    }, 3000);
    lastNotification.value = notification;
  }
};

let websocket = null;

const initWebSocket = () => {
  if (websocket) return;

  websocket = new WebSocket(
    `wss://flopproject-1.onrender.com/ws/notification/?token=${appStore.accessToken}`
  );

  websocket.onopen = () => {
    console.log("WebSocket connection opened");
    websocket.send(
      JSON.stringify({
        type: "notification",
      })
    );
  };

  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
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
  router.push(`/room/${currentUser.value.id + id.sender_id}`);
};

onMounted(() => {
  if (appStore.accessToken) {
    initWebSocket();
  }
});

// Watch for route changes to reset the notifications array
watch(route, () => {
  if (route.path.startsWith("/room")) {
    notifications.value = [];
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
  flex-direction: column-reverse;
  align-items: flex-end;
  z-index: 999;
}

.notifications__list {
  display: flex;
  flex-direction: column-reverse;
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

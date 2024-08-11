<template>
  <div class="notifications">
    <transition-group name="fade" tag="div" class="notifications__list">
      <div v-for="notification in notifications" :key="notification">
        <div
          v-if="notification.type == 'notification'"
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
        <div
          v-if="notification.type == 'call_notification'"
          class="notification-call"
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
          <div class="notification__body-call">
            <div class="icon-wrapper-green" @click="answerCall(notification)">
              <img
                src="../assets/images/phone-svgrepo-com.svg"
                alt="answer call"
                class="contol-icon"
              />
            </div>
            <div class="icon-wrapper-red" @click="rejectCall">
              <img
                src="../assets/images/call-cancel-svgrepo-com.svg"
                alt="reject call"
                class="contol-icon"
              />
            </div>
          </div>
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
import { useCallStore } from "@/store/callStore";

const appStore = useAppStore();
const callStore = useCallStore();
const currentUser = computed(() => appStore.getUser);
const notifications = ref([]);
const lastNotification = ref(null);
const isRejected = ref(false);

const getSound = computed(() => appStore.getSound);
const route = useRoute();

const addNotification = (notification) => {
  if (route.path.startsWith("/room")) {
    return;
  }
  if (lastNotification.value !== notification) {
    if (notification.type == "notification") {
      notifications.value.unshift(notification);
      const audio = new Audio(require("@/assets/sounds/poosay.mp3"));
      if (getSound.value == true) {
        audio.play();
      } else {
        audio.muted;
      }
      setTimeout(() => {
        notifications.value.pop();
      }, 3000);
      lastNotification.value = notification;
    }
    if (notification.type == "call_notification") {
      notifications.value.unshift(notification);
      const audio = new Audio(require("@/assets/sounds/ringtone.mp3"));
      if (getSound.value == true) {
        setInterval(() => {
          if (!isRejected.value) audio.play();
        }, 4000);
      } else {
        audio.muted;
      }
      setTimeout(() => {
        notifications.value.pop();
      }, 60000);
    }
  }
};
const rejectCall = () => {
  notifications.value.pop();
  isRejected.value = true;
};
const answerCall = async (id) => {
  callStore.answerHandler();
  toChat(id);
};
let websocket = null;

const initWebSocket = () => {
  if (websocket) return;

  websocket = new WebSocket(
    `wss://flopproject-1.onrender.com/ws/notification/?token=${appStore.accessToken}`
  );

  websocket.onopen = () => {
    websocket.send(
      JSON.stringify({
        type: "notification",
        sender: currentUser.value,
      })
    );
  };

  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    addNotification(data);
  };

  websocket.onclose = () => {
    websocket = null;
  };

  websocket.onerror = () => {};
};

const toChat = (id) => {
  router.push({
    name: "room",
    params: { roomName: currentUser.value.id + id.sender_id },
    query: { recipientId: id.sender_id },
  });
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
  cursor: pointer;
  transition: opacity 0.5s ease;
}
.notification-call {
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
.notification__body-call {
  display: flex;
  gap: 30px;
}
.icon-wrapper-green,
.icon-wrapper-red {
  cursor: pointer;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}
.icon-wrapper-green {
  background-color: rgb(0, 178, 0);
}
.icon-wrapper-green:hover {
  background-color: rgb(0, 255, 47);
}

.icon-wrapper-red {
  background-color: rgb(197, 0, 0);
}
.icon-wrapper-red:hover {
  background-color: #ff0000;
}
.contol-icon {
  width: 30px;
  height: 30px;
}
</style>

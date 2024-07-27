<template>
  <div class="chat-room__wrapper" v-if="currentUser">
    <div class="chat-room">
      <div v-if="profileUser" class="chat-room__header">
        <div class="user__wrapper">
          <img
            :src="
              profileUser.avatar
                ? profileUser.avatar
                : require('../assets/images/placeholder.png')
            "
            alt="User Avatar"
            class="user-avatar"
          />
          <h3>{{ profileUser.username }}</h3>
        </div>
        <div>
          <img
            @click="openModal"
            class="icon__call"
            src="../assets/images/phone-svgrepo-com.svg"
            alt="icon call"
          />
        </div>
      </div>
      <div class="chat-room__messages" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.content"
          :class="{
            message: true,
            'message--own': message.sender == currentUser.username,
            'message--other': message.sender != currentUser.username,
          }"
        >
          <div class="message__header">
            <img
              :src="
                message.avatar
                  ? message.avatar
                  : require('../assets/images/placeholder.png')
              "
              alt="User Avatar"
              class="message__avatar"
            />
            <span class="message__username">{{ message.sender }}</span>
          </div>
          <div class="message__body">
            <div class="message__content">
              <p>{{ message.message }}</p>
              <img
                v-if="message.sender == currentUser.username"
                :src="
                  message.isRead
                    ? require('../assets/images/tick-double-svgrepo-com.svg')
                    : require('../assets/images/tick-svgrepo-com.svg')
                "
                alt="is read"
                class="read__icon"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="chat-room__input-container">
        <input
          v-model="newMessage"
          type="text"
          class="chat-room__input"
          placeholder="Type your message..."
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage" class="chat-room__button--send">
          Send
        </button>
      </div>
    </div>
    <CallModal
      :isVisible="isVisible"
      :profileUser="profileUser"
      @close="openModal"
    ></CallModal>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from "vue";
import { useAppStore } from "@/store/app.js";
import { useRoute } from "vue-router";

import CallModal from "@/components/CallModal.vue";

const appStore = useAppStore();
const route = useRoute();
const currentUser = computed(() => appStore.getUser);
const profileUser = computed(() => appStore.profileUser);
const messages = computed(() => appStore.chatMessages);
const newMessage = ref("");
const messagesContainer = ref(null);
const isVisible = ref(false);

const recipientId = route.query.recipientId;

const sendMessage = async () => {
  if (newMessage.value.trim() === "") return;
  const message = {
    sender: currentUser.value,
    content: newMessage.value,
    recipient: profileUser.value,
  };
  appStore.sendMessage(message);
  newMessage.value = "";
  await nextTick();
  scrollToBottom();
};

const openModal = () => {
  isVisible.value = !isVisible.value;
};

const scrollToBottom = () => {
  const container = messagesContainer.value;
  if (container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }
};

onMounted(async () => {
  await appStore.getUserById(recipientId);
  appStore.initWebSocket(
    route.params.roomName,
    currentUser.value,
    profileUser.value
  );
  scrollToBottom();
});

onUnmounted(() => {
  appStore.closeWebSocket();
});

watch(
  messages.value,
  async () => {
    await nextTick();
    scrollToBottom();
  },
  { immediate: true, deep: true, flush: "post" }
);
</script>

<style scoped>
.chat-room__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.chat-room {
  background-color: #ffffff;
  width: 100%;
  max-width: 600px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.chat-room__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.user__wrapper {
  display: flex;
  align-items: center;
}

.chat-room__messages {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 10px;
}

.chat-room__messages::-webkit-scrollbar {
  width: 6px;
}

.chat-room__messages::-webkit-scrollbar-thumb {
  background-color: #d2d7d9;
  border-radius: 10px;
}

.chat-room__messages::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  max-width: 80%;
  position: relative; /* Added */
}

.message--own {
  background-color: #d4eaff;
  margin-left: auto;
}

.message--other {
  background-color: #f0f0f0;
  margin-right: auto;
}

.message__header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.message__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.message__username {
  font-weight: bold;
  font-size: 16px;
}

.message__body {
  font-size: 14px;
}

.message__content {
  position: relative;
  padding-right: 20px; /* Added padding to avoid overlap */
}

.read__icon {
  width: 16px; /* Adjust the size as needed */
  height: 16px;
  position: absolute;
  bottom: 0;
  right: 0;
}

.chat-room__input-container {
  display: flex;
  align-items: center;
}

.chat-room__input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: box-shadow 0.3s ease;
}

.chat-room__button--send,
.chat-room__button--leave {
  background-color: #2596be;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 10px;
}

.chat-room__button--send:hover,
.chat-room__button--leave:hover {
  background-color: #10aae2;
}
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.icon__call {
  cursor: pointer;
  width: 30px;
  height: 30px;
  transition: rotate 0.3s ease;
}
.icon__call:hover {
  rotate: 10deg;
}
</style>

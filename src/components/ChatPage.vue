<template>
  <div class="chat-room__wrapper" v-if="currentUser">
    <div class="chat-room">
      <div class="chat-room__header">
        <h3>FlopoGram</h3>
        <button @click="leaveChat" class="chat-room__button--leave">
          Leave Chat
        </button>
      </div>
      <div class="chat-room__messages" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="{
            message: true,
            'message--own': message.userId === currentUser.id,
            'message--other': message.userId !== currentUser.id,
          }"
        >
          <!-- <div class="message__header">
            <img
              :src="
                message.user.avatar
                  ? message.user.avatar
                  : require('../assets/images/placeholder.png')
              "
              alt="User Avatar"
              class="message__avatar"
            />
            <span class="message__username">{{ message.user.username }}</span>
          </div> -->
          <div class="message__body">
            <p>{{ message }}</p>
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
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue";
import { useAppStore } from "@/store/app.js";

const appStore = useAppStore();
const currentUser = computed(() => appStore.getUser);
const messages = computed(() => appStore.chatMessages);
const newMessage = ref("");
const messagesContainer = ref(null);
import { useRoute } from "vue-router";
const route = useRoute();

const sendMessage = async () => {
  if (newMessage.value.trim() === "") return;
  const message = newMessage.value;
  appStore.sendMessage(message);
  newMessage.value = "";
  await nextTick();
  scrollToBottom();
};

const scrollToBottom = () => {
  const container = messagesContainer.value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};

const leaveChat = () => {
  appStore.closeWebSocket();
};

onMounted(async () => {
  appStore.initWebSocket(route.params.roomName);
  scrollToBottom();
});

onUnmounted(() => {
  appStore.closeWebSocket();
});
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
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.chat-room__messages {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  border-radius: 10px;
  max-width: 80%;
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
</style>
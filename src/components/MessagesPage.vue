<template>
  <div class="chat-room__wrapper" v-if="currentUser">
    <div class="previous-chats">
      <h2>Previous Chats</h2>
      <div
        v-for="chat in previousChats"
        :key="chat.id"
        @click="toChat(chat)"
        class="previous-chat"
      >
        <div class="previous-chat__header">
          <img
            :src="
              chat.avatar
                ? chat.avatar
                : require('../assets/images/placeholder.png')
            "
            alt="User Avatar"
            class="previous-chat__avatar"
          />
          <span class="previous-chat__username">{{ chat.username }}</span>
        </div>
        <!-- <div class="previous-chat__body">
          <p>{{ chat.lastMessage }}</p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useAppStore } from "@/store/app.js";
import { useRouter } from "vue-router";

const appStore = useAppStore();
const router = useRouter();
const currentUser = computed(() => appStore.getUser);
const previousChats = computed(() => appStore.getResentChats);

const toChat = (id) => {
  router.push({
    name: "room",
    params: { roomName: currentUser.value.id + id.id },
    query: { recipientId: id.id },
  });
};

onMounted(async () => {
  await appStore.setRessentChats();
});
</script>

<style scoped>
.chat-room__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.previous-chats {
  background-color: #ffffff;
  width: 100%;
  max-width: 600px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  max-height: 540px;
  overflow-y: auto;
}

.previous-chats::-webkit-scrollbar {
  width: 6px;
}

.previous-chats::-webkit-scrollbar-thumb {
  background-color: #d2d7d9;
  border-radius: 10px;
}

.previous-chats::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 10px;
}

.previous-chats h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #2596be;
}

.previous-chat {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}

.previous-chat:hover {
  background-color: #f0f0f0;
}

.previous-chat__header {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.previous-chat__avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.previous-chat__username {
  font-weight: bold;
  font-size: 18px;
  color: #333;
}

.previous-chat__body {
  font-size: 14px;
  color: #666;
}
</style>

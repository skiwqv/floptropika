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
            @click="sendCallRequest"
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
    <div v-if="isVisible" class="modal">
      <div class="modal-content">
        <!-- <div class="call__wrapper">
          <img
            :src="
              profileUser.avatar || require('../assets/images/placeholder.png')
            "
            alt="User Avatar"
            class="call-avatar"
          />
          <h3>{{ profileUser.username }}</h3>
        </div> -->
        <div class="control__wrapper">
          <div class="microphone__icon-wrapper" @click="toggleMicrophone">
            <img :src="microphoneIcon" class="microphone__icon" />
          </div>
          <div class="cancel__call-wrapper" @click="endCall">
            <img
              src="../assets/images/call-cancel-svgrepo-com.svg"
              class="cancel__call"
            />
          </div>
        </div>
        <audio autoplay ref="audioElement"></audio>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/store/app";
import { useCallStore } from "@/store/callStore";

const appStore = useAppStore();
const callStore = useCallStore;
const route = useRoute();
const currentUser = computed(() => appStore.getUser);
const profileUser = computed(() => appStore.profileUser);
const messages = computed(() => appStore.chatMessages);
const newMessage = ref("");
const messagesContainer = ref(null);
const isMicrophoneEnabled = ref(true);
const audioElement = ref(null);
import router from "@/router";

const recipientId = route.query.recipientId;

const isVisible = computed(() => appStore.isVisible);
const isAnswered = computed(() => callStore.isAnswered);
const microphoneIcon = computed(() => {
  return isMicrophoneEnabled.value
    ? require("../assets/images/microphone-svgrepo-com.svg")
    : require("../assets/images/microphone-slash-svgrepo-com.svg");
});

const toggleMicrophone = () => {
  isMicrophoneEnabled.value = !isMicrophoneEnabled.value;
  const tracks = audioElement.value.srcObject.getAudioTracks();
  tracks.forEach((track) => {
    track.enabled = isMicrophoneEnabled.value;
  });
};

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

const sendCallRequest = async () => {
  const message = {
    sender: currentUser.value,
    recipient: profileUser.value,
  };

  appStore.sendCallRequest(message);
  appStore.visibleHandler();

  router.push({
    path: route.path,
    query: {
      ...route.query,
      initiator: true,
    },
  });
};

let peerConnection;
let connection;

function startCall() {
  connection = new WebSocket(
    `wss://flopproject-1.onrender.com/ws/call/${route.params.roomName}/?token=${appStore.accessToken}`
  );

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  peerConnection = new RTCPeerConnection(configuration);

  // Handle ICE candidates
  peerConnection.onicecandidate = function (event) {
    if (event.candidate) {
      connection.send(
        JSON.stringify({ type: "candidate", candidate: event.candidate })
      );
    }
  };

  // Once remote track media is received, display it
  peerConnection.ontrack = function (event) {
    audioElement.value.srcObject = event.streams[0];
  };

  // Get local audio stream
  navigator.mediaDevices
    .getUserMedia({ audio: true }) // Removed video, only audio remains
    .then((stream) => {
      audioElement.value.srcObject = stream;
      stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, stream));
    })
    .catch((error) => console.error("Error accessing media devices.", error));

  // WebSocket event listeners
  connection.onopen = function () {
    console.log("WebSocket connection established");
  };

  connection.onmessage = function (message) {
    const data = JSON.parse(message.data);
    handleSignalingData(data);
  };

  connection.onerror = function (error) {
    console.error("WebSocket error: ", error);
  };

  connection.onclose = function () {
    console.log("WebSocket connection closed");
  };
}

// Handling signaling data received via WebSocket
function handleSignalingData(data) {
  switch (data.type) {
    case "offer":
      handleOffer(data.offer);
      break;
    case "answer":
      handleAnswer(data.answer);
      break;
    case "candidate":
      handleCandidate(data.candidate);
      break;
    default:
      break;
  }
}

function handleOffer(offer) {
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  // create an answer to send back to the peer
  peerConnection.createAnswer().then((answer) => {
    peerConnection.setLocalDescription(answer);
    connection.send(JSON.stringify({ type: "answer", answer: answer }));
  });
}

function handleAnswer(answer) {
  peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

function handleCandidate(candidate) {
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

const endCall = () => {
  appStore.visibleHandler();
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
  setTimeout(() => {
    startCall();
  }, 3000);
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
watch(
  isVisible.value,
  async () => {
    if (isAnswered.value) {
      startCall();
    }
  },
  { immediate: true, deep: true }
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
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  width: 90%;
  max-width: 400px;
  height: 60%;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.call__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.call-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.control__wrapper {
  display: flex;
  gap: 20px;
}

.microphone__icon-wrapper,
.cancel__call-wrapper {
  cursor: pointer;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.microphone__icon-wrapper {
  background-color: #2596be;
}

.microphone__icon-wrapper:hover {
  background-color: #1ba8db;
}

.microphone__icon {
  width: 30px;
}

.cancel__call-wrapper {
  background-color: red;
}

.cancel__call-wrapper:hover {
  background-color: rgb(248, 62, 62);
}

.cancel__call {
  width: 30px;
}
</style>

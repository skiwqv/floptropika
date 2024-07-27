<template>
  <div v-if="props.isVisible" class="modal">
    <div class="modal-content">
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
      <div class="control__wrapper">
        <div class="microphone__icon-wrapper" @click="enableMicrophone">
          <img class="microphone__icon" :src="microphoneIcon" />
        </div>
        <div class="cancel__call-wrapper" @click="closeModal">
          <img
            class="cancel__call"
            src="../assets/images/call-cancel-svgrepo-com.svg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref, defineEmits } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  profileUser: {
    type: Object,
  },
});

const emits = defineEmits(["close"]);

const profileUser = computed(() => props.profileUser);
const isMicrophoneEnabled = ref(true);

const enableMicrophone = () => {
  isMicrophoneEnabled.value = !isMicrophoneEnabled.value;
};

const microphoneIcon = computed(() => {
  return isMicrophoneEnabled.value
    ? require("../assets/images/microphone-svgrepo-com.svg")
    : require("../assets/images/microphone-slash-svgrepo-com.svg");
});

const closeModal = () => {
  emits("close");
};
</script>

<style scoped>
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
  max-height: 600px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.user__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  object-fit: cover;
}

.control__wrapper {
  display: flex;

  gap: 20px;
}

.microphone__icon-wrapper {
  cursor: pointer;
  width: 50px;
  height: 50px;
  background-color: #2596be;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.microphone__icon-wrapper:hover {
  background-color: #1ba8db;
}

.microphone__icon {
  width: 30px;
  height: 30px;
}

.cancel__call-wrapper {
  width: 50px;
  height: 50px;
  background-color: red;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.cancel__call-wrapper:hover {
  background-color: rgb(248, 62, 62);
}

.cancel__call {
  cursor: pointer;
  width: 30px;
  height: 30px;
}
</style>

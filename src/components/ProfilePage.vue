<template>
  <div class="profile__wrapper" v-if="profileUser">
    <div class="profile">
      <div class="profile__header">
        <h3 ref="text">{{ profileUser.username }}'s Profile</h3>
        <button
          @click="toggleEdit"
          class="profile__button--edit"
          v-if="currentUser.id == profileUser.id"
        >
          Edit
        </button>
      </div>
      <div class="profile__image-container">
        <img
          :src="
            profileUser.avatar
              ? profileUser.avatar
              : require('../assets/images/placeholder.png')
          "
          alt="Profile Picture"
          class="image-preview"
        />
        <img
          v-if="imageSrc"
          :src="imagePreview"
          alt="New Profile Picture"
          class="image-preview-new"
        />
        <button
          v-if="isEditing"
          type="button"
          class="upload-button"
          @click="triggerFileInput"
        >
          Choose Image
        </button>
        <input
          type="file"
          accept="image/*"
          @change="onFileChange"
          ref="fileInput"
          class="hidden-input"
        />
        <input
          type="file"
          accept="audio/*"
          @change="onMusicChange"
          ref="musicInput"
          class="hidden-input"
        />
      </div>
      <div class="profile__field">
        <label class="profile__label">Username</label>
        <span v-if="!isEditing" class="profile__value">{{
          profileUser.username
        }}</span>
        <input
          v-else
          v-model="profileUser.username"
          type="text"
          class="profile__input"
        />
      </div>
      <div class="profile__field">
        <label class="profile__label">Email</label>
        <span v-if="!isEditing" class="profile__value">{{
          profileUser.email
        }}</span>
        <input
          v-else
          v-model="profileUser.email"
          type="email"
          class="profile__input"
        />
      </div>
      <div class="profile__field">
        <label class="profile__label">Bio</label>
        <span v-if="!isEditing" class="profile__value">{{
          profileUser.bio
        }}</span>
        <textarea
          v-else
          v-model="profileUser.bio"
          class="profile__textarea"
        ></textarea>
      </div>
      <div v-if="profileUser.profile_music" class="profile__music-container">
        <audio
          controls
          :src="profileUser.profile_music"
          class="audio-preview"
        ></audio>
      </div>
      <span v-if="musicName" class="file-name">{{ musicName }}</span>
      <div v-if="musicPreview" class="profile__music-container">
        <audio controls :src="musicPreview" class="audio-preview"></audio>
      </div>
      <button
        v-if="isEditing"
        type="button"
        class="upload-button"
        @click="triggerMusicInput"
      >
        Choose Music
      </button>
      <button
        v-if="currentUser.id != profileUser.id"
        @click="toChat"
        class="profile__button"
      >
        Send Message
      </button>
      <button v-if="isEditing" @click="saveProfile" class="profile__button">
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAppStore } from "@/store/app.js";
import { useRoute } from "vue-router";
import router from "@/router";

const appStore = useAppStore();
const currentUser = computed(() => appStore.getUser);
const profileUser = computed(() => appStore.profileUser);
const route = useRoute();
const isEditing = ref(false);

const imageSrc = ref(null);
const fileName = ref(null);
const fileInput = ref(null);
const imagePreview = ref(null);

const musicSrc = ref(null);
const musicName = ref(null);
const musicInput = ref(null);
const musicPreview = ref(null);

const text = ref(null);

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const toChat = () => {
  router.push({
    name: "room",
    params: { roomName: currentUser.value.id + profileUser.value.id },
    query: { recipientId: profileUser.value.id },
  });
};

const saveProfile = async () => {
  const user = {
    username: profileUser.value.username,
    email: profileUser.value.email,
    avatar: imageSrc.value,
    bio: profileUser.value.bio,
    profile_music: musicSrc.value,
  };
  await appStore.sendPhoto(user);
  await appStore.sendMusic(user);
  await appStore.getCurrentUser();
  await appStore.getUserById(currentUser.value.id);
  imageSrc.value = null;
  fileName.value = null;
  imagePreview.value = null;
  musicSrc.value = null;
  musicName.value = null;
  musicPreview.value = null;
  isEditing.value = false;
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  imageSrc.value = file;
  fileName.value = file.name;
  imagePreview.value = URL.createObjectURL(file);
};

const onMusicChange = (event) => {
  const file = event.target.files[0];
  musicSrc.value = file;
  musicName.value = file.name;
  musicPreview.value = URL.createObjectURL(file);
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const triggerMusicInput = () => {
  musicInput.value.click();
};

onMounted(async () => {
  await appStore.getUserById(route.params.userId);
});
</script>

<style scoped>
.profile__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.profile {
  background-color: #ffffff;
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.profile__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.profile__image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.profile__field {
  margin: 10px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.profile__label {
  font-weight: bold;
  margin-bottom: 5px;
}

.profile__value {
  font-size: 16px;
  margin-bottom: 10px;
}

.profile__input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: box-shadow 0.3s ease;
}

.profile__textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: box-shadow 0.3s ease;
  resize: vertical;
}

.profile__input:focus,
.profile__textarea:focus {
  box-shadow: 0 0 10px rgba(242, 0, 145, 0.8);
}

.profile__button {
  background-color: #2596be;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 20px;
}

.profile__button--edit {
  background-color: #2596be;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.profile__button--edit:hover {
  background-color: #10aae2;
}

.upload-button {
  background-color: #2596be;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.upload-button:hover {
  background-color: #10aae2;
}

.file-name {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.image-preview,
.image-preview-new {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.image-preview-new {
  border: 2px dashed #2596be;
}

.hidden-input {
  display: none;
}

.profile__music-container {
  margin-top: 20px;
}

.audio-preview {
  width: 100%;
  height: 50px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  outline: none;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.audio-preview:hover,
.audio-preview:focus {
  border: 1px solid #2596be;
  box-shadow: 0 0 10px rgba(242, 0, 145, 0.8);
}

.audio-preview::-webkit-media-controls-panel {
  background-color: #f9f9f9;
  border-radius: 5px;
}
</style>

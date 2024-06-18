<template>
  <div class="profile__wrapper" v-if="currentUser">
    <div class="profile">
      <h3 ref="text">Profile</h3>
      <button
        @click="toggleEdit"
        class="profile__button--edit"
        v-if="currentUser.id == route.params.userId"
      >
        Edit
      </button>
      <img :src="currentUser.avatar" alt="Preview" class="image-preview" />
      <span>{{ fileName }}</span>
      <button type="button" class="upload-button" @click="triggerFileInput">
        Choose Image
      </button>
      <div class="profile__field">
        <form enctype="multipart/form-data">
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            ref="fileInput"
            class="hidden-input"
          />
        </form>
        <span v-if="fileName" class="file-name">{{ fileName }}</span>
        <label class="username">Username:</label>
        <span v-if="!isEditing" class="username">{{
          currentUser.username
        }}</span>
        <input
          v-else
          v-model="currentUser.username"
          type="text"
          class="profile__input"
        />
      </div>
      <div class="profile__field">
        <label class="username">Email:</label>
        <span v-if="!isEditing" class="username">{{ currentUser.email }}</span>
        <input
          v-else
          v-model="currentUser.email"
          type="email"
          class="profile__input"
        />
      </div>
      <button v-if="isEditing" @click="saveProfile" class="profile__button">
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAppStore } from "@/store/app.js";
import { useRoute } from "vue-router";

const appStore = useAppStore();
const currentUser = computed(() => appStore.getUser);
const route = useRoute();

const isEditing = ref(false);

const imageSrc = ref(null);
const fileName = ref(null);
const fileInput = ref(null);

const text = ref(null);

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const saveProfile = async () => {
  const user = {
    username: currentUser.value.username,
    email: currentUser.value.email,
    avatar: imageSrc.value,
    bio: null,
  };
  await appStore.sendPhoto(user);
  await appStore.getCurrentUser();
  isEditing.value = false;
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  imageSrc.value = file;
  fileName.value = file.name;
};

const triggerFileInput = () => {
  fileInput.value.click();
};
</script>

<style scoped>
.profile__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile {
  background-color: #ffffffa8;
  width: 400px;
  height: auto;
  max-width: 90%;
  padding: 30px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.profile__field {
  margin: 10px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile__input {
  width: 60%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 24px;
  outline: none;
  transition: box-shadow 0.3s ease;
}

.profile__input:focus {
  box-shadow: 0 0 10px rgba(242, 0, 145, 0.8);
}

.profile__button {
  background-color: #2596be;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
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
  align-self: flex-end;
  margin-bottom: 20px;
}

.profile__button--edit:hover {
  background-color: #10aae2;
}
.username {
  font-size: 24px;
}
.profile__image {
  max-width: 400px;
  max-height: 400px;
}

.upload-button {
  background-color: #2596be;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 9px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 10px 0;
}

.upload-button:hover {
  background-color: #10aae2;
}

.file-name {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.image-preview {
  vertical-align: middle;
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
.hidden-input {
  display: none;
}
</style>

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
      <div class="profile__field">
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

const text = ref(null);

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const saveProfile = async () => {
  // Сохранение профиля пользователя
  isEditing.value = false;
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
</style>

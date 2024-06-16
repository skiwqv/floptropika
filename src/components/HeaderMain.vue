<template>
  <div class="header">
    <img src="../assets/images/rename.png" class="header__logo" />
    <div class="header__wrapper">
      <router-link
        to="/"
        active-class="header__link_active"
        class="header__link"
        >Home</router-link
      >
      <router-link to="/" class="header__link">About us</router-link>
    </div>
    <router-link
      to="/login"
      class="header__button"
      active-class="header__button_active"
      >Login</router-link
    >
    <router-link
      to="/login"
      class="header__button"
      active-class="header__button_active"
      >Logout</router-link
    >
    <div v-if="currentUser">{{ currentUser.username }}</div>
    <div>{{ currentUser }}</div>
    <div>{{ token }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/store/app.js";

const appStore = useAppStore();
const currentUser = computed(() => appStore.getUser);
const token = computed(() => appStore.token);
</script>

<style scoped>
.header {
  background-color: #ffffffad;
  display: flex;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header__logo {
  max-width: 70px;
  max-height: 40px;
  cursor: pointer;
  transition: box-shadow 0.3s;
}
.header__logo:hover {
  box-shadow: 0 0 10px rgba(16, 170, 226, 0.8);
}

.header__wrapper {
  display: flex;
  justify-content: center;
  flex-grow: 1;
}

.header__link {
  text-decoration: none;
  font-size: 18px;
  color: black;
  margin: 0 10px;
  transition: text-shadow 0.3s;
}

.header__button {
  background-color: #2596be;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  border-radius: 9px;
  cursor: pointer;
  color: black;
  text-decoration: none;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.header__button:hover {
  background-color: #10aae2;
  box-shadow: 0 0 10px rgba(16, 170, 226, 0.8);
}
.header__link:hover {
  text-shadow: 0 0 10px rgba(16, 170, 226, 0.8);
}

.button__link {
  text-decoration: none;
  color: inherit;
}
.header__link_active {
  text-shadow: 0 0 10px rgba(16, 170, 226, 0.8);
  color: white;
}
.header__button_active {
  background-color: #10aae2;
  color: white;
  box-shadow: 0 0 10px rgba(16, 170, 226, 0.8);
  border-radius: 9px;
}
</style>
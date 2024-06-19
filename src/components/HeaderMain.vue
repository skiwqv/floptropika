<template>
  <div class="header">
    <img
      src="../assets/images/rename.png"
      class="header__logo"
      @click="toHome"
    />
    <div class="header__wrapper">
      <router-link
        to="/about"
        class="header__link"
        active-class="header__link_active"
        >About us</router-link
      >
      <router-link
        v-if="currentUser"
        to="/postLegend"
        class="header__link"
        active-class="header__link_active"
        >Post Legend</router-link
      >
    </div>
    <router-link
      v-if="!currentUser"
      to="/login"
      class="header__button"
      active-class="header__button_active"
      >Login</router-link
    >
    <div v-if="currentUser" class="user-menu" @click="toggleDropdown">
      <img :src="currentUser.avatar" alt="User Avatar" class="user-avatar" />
      {{ currentUser.username }}
      <span class="arrow">&#9662;</span>
      <div v-if="isDropdownVisible" class="dropdown">
        <button @click="toProfile">Profile</button>
        <button @click="toLegends">My Legends</button>
        <button @click="logOut">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAppStore } from "@/store/app.js";
import router from "@/router";

const appStore = useAppStore();
const currentUser = computed(() => appStore.getUser);
const isDropdownVisible = ref(false);

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};

const toHome = () => {
  router.push("/");
};

const toProfile = () => {
  router.push(`/profile/${currentUser.value.id}`);
};

const toLegends = () => {
  router.push("/my-legends");
};

const logOut = async () => {
  await appStore.logout();
  router.push("/");
  isDropdownVisible.value = false; // Close the dropdown after logging out
};
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
  transition: box-shadow 0.3s, transform 0.3s;
}
.header__logo:hover {
  transform: rotate(360deg);
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

.user-menu {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.arrow {
  margin-left: 5px;
}

.dropdown {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid #ccc;
  right: -16px;
  top: 50px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin-top: 10px;
  max-width: 200px;
}

.dropdown button {
  background-color: #2596be;
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  border-radius: 9px;
  cursor: pointer;
  color: black;
  text-decoration: none;
  transition: background-color 0.3s, box-shadow 0.3s;
  margin-top: 10px;
}

.dropdown button:hover {
  background-color: #10aae2;
  box-shadow: 0 0 10px rgba(16, 170, 226, 0.8);
}
</style>

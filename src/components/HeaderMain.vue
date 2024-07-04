<template>
  <header class="header">
    <img
      src="../assets/images/rename.png"
      class="header__logo"
      @click="toHome"
    />
    <nav class="header__nav">
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
      <router-link
        v-if="currentUser"
        to="/messages"
        class="header__link"
        active-class="header__link_active"
        >Messages</router-link
      >
      <router-link
        v-if="!currentUser"
        to="/login"
        class="header__button"
        active-class="header__button_active"
        >Login</router-link
      >
    </nav>
    <div v-if="currentUser" class="header__user">
      <img
        @click="soundHandler"
        :src="isSound"
        alt="sound"
        class="header__sound-icon"
      />
      <div class="header__user-menu" @click="toggleDropdown">
        <img
          :src="currentUser.avatar || placeholderAvatar"
          alt="User Avatar"
          class="header__user-avatar"
        />
        <span class="header__username">{{ currentUser.username }}</span>
        <span class="header__arrow">&#9662;</span>
        <div v-if="isDropdownVisible" class="header__dropdown">
          <button @click="toProfile">Profile</button>
          <button @click="toLegends">My Legends</button>
          <button @click="logOut">Logout</button>
        </div>
      </div>
    </div>
    <button class="header__burger" @click="toggleSidebar">&#9776;</button>
    <div :class="['sidebar', { 'sidebar--open': isSidebarOpen }]">
      <button class="sidebar__close" @click="toggleSidebar">&times;</button>
      <router-link
        to="/about"
        class="sidebar__link"
        active-class="sidebar__link_active"
        >About us</router-link
      >
      <router-link
        v-if="currentUser"
        to="/postLegend"
        class="sidebar__link"
        active-class="sidebar__link_active"
        >Post Legend</router-link
      >
      <router-link
        v-if="currentUser"
        to="/messages"
        class="sidebar__link"
        active-class="sidebar__link_active"
        >Messages</router-link
      >
      <router-link
        v-if="!currentUser"
        to="/login"
        class="sidebar__button"
        active-class="sidebar__button_active"
        >Login</router-link
      >
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAppStore } from "@/store/app";
import { useRouter } from "vue-router";

const appStore = useAppStore();
const router = useRouter();
const currentUser = computed(() => appStore.getUser);
const isDropdownVisible = ref(false);
const isSidebarOpen = ref(false);
const placeholderAvatar = require("../assets/images/placeholder.png");

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const soundHandler = () => {
  appStore.soundHandler();
};

const isSound = computed(() => {
  return appStore.getSound
    ? require("../assets/images/sound_on.svg")
    : require("../assets/images/sound_off.svg");
});

const toHome = () => {
  router.push("/");
  console.log(currentUser.value);
};

const toProfile = async () => {
  router.push(`/profile/${currentUser.value.id}`);
  await appStore.getUserById(currentUser.value.id);
};

const toLegends = () => {
  router.push("/myLegends");
};

const logOut = async () => {
  await appStore.logout();
  router.push("/");
  isDropdownVisible.value = false; // Close the dropdown after logging out
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.68);
  padding: 0 20px;
  height: 80px;
  position: relative;
}

.header__logo {
  max-width: 70px;
  max-height: 40px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.header__logo:hover {
  transform: rotate(360deg);
  box-shadow: 0 0 10px rgba(16, 170, 226, 0.8);
}

.header__nav {
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: center;
}

.header__link,
.header__button {
  font-size: 18px;
  margin: 0 10px;
  text-decoration: none;
  color: black;
  transition: text-shadow 0.3s, background-color 0.3s, box-shadow 0.3s;
}

.header__link:hover,
.header__button:hover {
  text-shadow: 0 0 10px rgba(16, 170, 226, 0.8);
}

.header__button {
  background-color: #2596be;
  padding: 10px 20px;
  border-radius: 9px;
  cursor: pointer;
  border: none;
}

.header__link_active,
.header__button_active {
  color: white;
  text-shadow: 0 0 10px rgba(16, 170, 226, 0.8);
}

.header__user {
  display: flex;
  align-items: center;
}

.header__sound-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 10px;
  transition: transform 0.3s;
}

.header__sound-icon:hover {
  animation: swing 0.5s ease;
}

.header__user-menu {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header__user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.header__username {
  font-size: 18px;
}

.header__arrow {
  margin-left: 5px;
}

.header__dropdown {
  position: absolute;
  top: 50px;
  right: -16px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 999;
}

.header__dropdown button {
  font-size: 18px;
  background-color: #2596be;
  border: none;
  padding: 10px 20px;
  border-radius: 9px;
  cursor: pointer;
  color: black;
  transition: background-color 0.3s, box-shadow 0.3s;
  margin-top: 10px;
}

.header__dropdown button:hover {
  background-color: #10aae2;
  box-shadow: 0 0 10px rgba(16, 170, 226, 0.8);
}

.header__burger {
  display: none;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
}

.sidebar {
  position: fixed;
  top: 0;
  right: -450px;
  width: 250px;
  height: 100%;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  transition: right 0.3s ease-in-out;
  z-index: 800;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar--open {
  right: 0;
}

.sidebar__close {
  align-self: flex-end;
  font-size: 30px;
  border: none;
  background: none;
  cursor: pointer;
}

.sidebar__link,
.sidebar__button {
  font-size: 24px;
  margin: 10px 0;
  text-decoration: none;
  color: black;
  transition: text-shadow 0.3s, background-color 0.3s, box-shadow 0.3s;
}

.sidebar__link:hover,
.sidebar__button:hover {
  text-shadow: 0 0 10px rgba(16, 170, 226, 0.8);
}

.sidebar__button {
  background-color: #2596be;
  padding: 10px 20px;
  border-radius: 9px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: none;
}

.sidebar__link_active,
.sidebar__button_active {
  color: white;
  background-color: #10aae2;
  border-radius: 9px;
  height: 40px;
  box-shadow: 0 0 10px rgba(16, 170, 226, 0.8);
}

@media (max-width: 576px) {
  .header__nav {
    display: none;
  }

  .header__burger {
    display: block;
  }
}

@keyframes swing {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>

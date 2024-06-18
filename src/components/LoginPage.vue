<template>
  <div class="login__wrapper">
    <form class="login" @submit.prevent="login">
      <h3 ref="text">FLOPTROPIKA</h3>
      <input
        v-model="user.username"
        type="text"
        placeholder="Username"
        class="login__input"
        ref="usernameInput"
      />
      <input
        v-model="user.password"
        type="password"
        placeholder="Password"
        class="login__input"
        ref="passwordInput"
      />
      <button class="login__button" :disabled="isDisabled" ref="loginButton">
        Login
      </button>
      <p class="login__register" ref="description">
        Don't have an account?
        <router-link to="/registration">Register here</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import gsap from "gsap";
import { useAppStore } from "@/store/app.js";
import router from "@/router";

const appStore = useAppStore();
const user = ref({
  username: "",
  password: "",
});

const text = ref(null);
const usernameInput = ref(null);
const passwordInput = ref(null);
const loginButton = ref(null);
const description = ref(null);
const isDisabled = computed(() => {
  return !(user.value.username !== "" && user.value.password !== "");
});

const loginAnim = () => {
  const tl = gsap.timeline();

  tl.from(text.value, { x: -50, opacity: 0, duration: 0.5 })
    .from(usernameInput.value, { x: -50, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(passwordInput.value, { x: -50, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(loginButton.value, { x: -50, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(description.value, { x: -50, opacity: 0, duration: 0.5 }, "-=0.3");
};

const login = async () => {
  appStore.playSound();
  const response = await appStore.signIn(user.value);
  if (response && response.status === 200) {
    router.push("/");
  }
};

onMounted(() => {
  loginAnim();
});
</script>

<style scoped>
.login__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login {
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

.login__input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: box-shadow 0.3s ease;
}

.login__input:focus {
  box-shadow: 0 0 10px rgba(242, 0, 145, 0.8);
}

.login__button {
  background-color: #2596be;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 9px;
  width: 30%;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login__button:hover {
  background-color: #10aae2;
}

.login__button:disabled {
  background-color: #ccc;
  color: #999;
  cursor: not-allowed;
}
</style>

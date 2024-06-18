<template>
  <div class="login__wrapper">
    <form class="login">
      <h3>FLOPTROPIKA</h3>
      <input
        v-model="user.username"
        type="text"
        placeholder="Username"
        class="login__input"
        required
      />
      <input
        v-model="user.email"
        type="email"
        placeholder="Email"
        class="login__input"
        required
      />
      <input
        v-model="user.password"
        type="password"
        placeholder="Password"
        class="login__input"
        required
      />
      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="login__input"
        required
      />
      <div
        v-confetti="{ particleCount: 200, force: 1 }"
        class="confetti"
        v-if="isVisible"
      ></div>
      <button
        @click.prevent="register"
        class="login__button"
        :disabled="isDisabled"
      >
        Register
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { vConfetti } from "@neoconfetti/vue";
import { useAppStore } from "@/store/app";
import router from "@/router";
const appStore = useAppStore();

const user = ref({
  username: "",
  email: "",
  password: "",
});
const isVisible = ref(false);
const confirmPassword = ref("");

const isDisabled = computed(() => {
  return !(
    user.value.username !== "" &&
    user.value.password !== "" &&
    user.value.email !== "" &&
    confirmPassword.value !== ""
  );
});

const register = async () => {
  appStore.playSound();
  const response = await appStore.register(user.value);
  if (response && response.status === 200) {
    isVisible.value = true;
    router.push("/login");
    return response;
  }
};
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

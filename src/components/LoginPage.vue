<template>
  <div class="login__wrapper">
    <form class="login" @submit.prevent="login">
      <h3 ref="text">FLOPTROPIKA</h3>
      <input
        v-model="user.username"
        type="text"
        placeholder="Username"
        class="login__input"
        :class="{ 'is-invalid': $v.user.username.$error }"
        ref="usernameInput"
      />
      <input
        v-model="user.password"
        type="password"
        placeholder="Password"
        class="login__input"
        :class="{ 'is-invalid': $v.user.password.$error }"
        ref="passwordInput"
      />
      <button class="login__button" ref="loginButton">Login</button>
      <p class="login__register" ref="description">
        Don't have an account?
        <router-link to="/registration">Register here</router-link>
      </p>
      <p v-if="loginError" class="error-message">
        Invalid username or password
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import gsap from "gsap";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useAppStore } from "@/store/app.js";
import router from "@/router";

const appStore = useAppStore();
const user = ref({
  username: "",
  password: "",
});

const loginError = ref(false);

const text = ref(null);
const usernameInput = ref(null);
const passwordInput = ref(null);
const loginButton = ref(null);
const description = ref(null);

const rules = computed(() => ({
  user: {
    username: { required },
    password: { required },
  },
}));

const $v = useVuelidate(rules, { user });

const loginAnim = () => {
  const tl = gsap.timeline();

  tl.from(text.value, { x: -50, opacity: 0, duration: 0.5 })
    .from(usernameInput.value, { x: -50, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(passwordInput.value, { x: -50, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(loginButton.value, { x: -50, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(description.value, { x: -50, opacity: 0, duration: 0.5 }, "-=0.3");
};

const login = async () => {
  $v.value.$touch();
  if ($v.value.$invalid) {
    return;
  }

  const response = await appStore.signIn(user.value);
  if (response && response.status === 200) {
    appStore.getCurrentUser();
    router.push("/");
  } else {
    loginError.value = true;
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

.is-invalid {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 10px;
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

.login__register {
  margin-top: 10px;
}
</style>

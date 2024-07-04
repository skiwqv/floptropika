<template>
  <div class="login__wrapper">
    <form @submit.prevent="register" class="login">
      <h3>FLOPTROPIKA</h3>
      <input
        v-model="user.username"
        type="text"
        placeholder="Username"
        class="login__input"
        :class="{ 'is-invalid': $v.user.username.$error }"
      />
      <div v-if="$v.user.username.$error" class="error-message">
        Username is required
      </div>

      <input
        v-model="user.email"
        type="email"
        placeholder="Email"
        class="login__input"
        :class="{ 'is-invalid': $v.user.email.$error }"
      />
      <div v-if="$v.user.email.$error" class="error-message">
        Valid email is required
      </div>

      <input
        v-model="user.password"
        type="password"
        placeholder="Password"
        class="login__input"
        :class="{ 'is-invalid': $v.user.password.$error }"
      />
      <div v-if="$v.user.password.$error" class="error-message">
        Password must be at least 8 characters long and contain at least one
        uppercase letter
      </div>

      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        class="login__input"
        :class="{ 'is-invalid': $v.confirmPassword.$error }"
      />
      <div v-if="$v.confirmPassword.$error" class="error-message">
        Passwords must match
      </div>
      <button class="login__button">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, sameAs } from "@vuelidate/validators";
import { useAppStore } from "@/store/app";
import router from "@/router";

const appStore = useAppStore();

const user = ref({
  username: "",
  email: "",
  password: "",
});
const confirmPassword = ref("");

const rules = computed(() => ({
  user: {
    username: { required },
    email: { required, email },
    password: {
      required,
      minLength: minLength(8),
      hasUpperCase: (value) =>
        /[A-Z]/.test(value) || "Must contain at least one uppercase letter",
    },
  },
  confirmPassword: {
    required,
    sameAsPassword: sameAs(user.value.password),
  },
}));

const $v = useVuelidate(rules, { user, confirmPassword });

const register = async () => {
  $v.value.$touch();
  if ($v.value.$invalid) {
    return;
  }

  const response = await appStore.register(user.value);
  if (response && response.status === 200) {
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

.is-invalid {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 10px;
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

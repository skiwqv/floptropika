<template>
  <div class="login__wrapper">
    <form class="login" @submit.prevent="login">
      <h3 ref="text">Post Floptok Legend</h3>
      <input
        v-model="legend.title"
        type="text"
        placeholder="Title"
        class="login__input"
        ref="usernameInput"
      />
      <input
        v-model="legend.description"
        type="text"
        placeholder="Description"
        class="login__input"
        ref="passwordInput"
      />
      <button type="button" class="upload-button" @click="triggerFileInput">
        Choose Image
      </button>
      <input
        type="file"
        accept="image/*"
        @change="onFileChange"
        ref="fileInput"
        class="hidden-input"
      />
      <span v-if="fileName" class="file-name">{{ fileName }}</span>
      <img
        v-if="imagePreview"
        :src="imagePreview"
        alt="Preview"
        class="image-preview"
      />

      <button
        class="login__button"
        ref="loginButton"
        @click="postLegend"
        :disabled="isDisabled"
      >
        Post
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import gsap from "gsap";
import { useAppStore } from "@/store/app.js";
import router from "@/router";

const appStore = useAppStore();

const imagePreview = ref(null);
const imageSrc = ref(null);
const fileName = ref(null);
const fileInput = ref(null);

const onFileChange = (event) => {
  const file = event.target.files[0];
  imageSrc.value = file;
  fileName.value = file.name;
  imagePreview.value = URL.createObjectURL(file);
};

const legend = ref({
  title: "",
  description: "",
  cover: imageSrc.value,
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const isDisabled = computed(() => {
  return !(
    legend.value.title !== "" &&
    legend.value.description !== "" &&
    imageSrc.value !== null
  );
});

const postLegend = async () => {
  const formData = new FormData();
  formData.append("title", legend.value.title);
  formData.append("description", legend.value.description);
  formData.append("cover", imageSrc.value);
  await appStore.postLegend(formData);
  router.push("/");
};

const text = ref(null);
const usernameInput = ref(null);
const passwordInput = ref(null);
const loginButton = ref(null);
const description = ref(null);

const loginAnim = () => {
  const tl = gsap.timeline();

  tl.from(text.value, { x: -50, opacity: 0, duration: 0.5 })
    .from(usernameInput.value, { x: -50, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(passwordInput.value, { x: -50, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(loginButton.value, { x: -50, opacity: 0, duration: 0.5 }, "-=0.3")
    .from(description.value, { x: -50, opacity: 0, duration: 0.5 }, "-=0.3");
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

.hidden-input {
  display: none;
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

.image-preview {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
  object-fit: cover;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>

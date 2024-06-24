<template>
  <div class="card-list" v-if="legends">
    <div class="card-items" v-for="legend in filteredLegends" :key="legend.id">
      <div class="nft">
        <div class="main">
          <img
            class="tokenImage"
            v-if="legend.cover"
            :src="legend.cover"
            alt="NFT"
          />
          <h2>{{ legend.title }}</h2>
          <p class="description">
            {{ legend.description }}
          </p>
          <hr />
          <div class="creator">
            <button class="edit__button" @click="openModal(legend)">
              Edit
            </button>
            <button @click="deletePost(legend.id)" class="delete__button">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" v-if="modal">
      <div class="modal__wrapper">
        <button @click="closeModal" class="x">❌</button>
        <img
          class="modalimage"
          v-if="selectedLegend.cover"
          :src="selectedLegend.cover"
          alt="NFT"
        />
        <input
          v-model="selectedLegend.title"
          type="text"
          placeholder="Title"
          class="login__input"
          ref="usernameInput"
        />
        <input
          v-model="selectedLegend.description"
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
          @click="updateLegend"
          :disabled="isDisabled"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/store/app";
import { computed, onMounted, ref } from "vue";
import gsap from "gsap";
const appStore = useAppStore();

const legends = computed(() => appStore.getAllLegends);

const currentUser = computed(() => appStore.getUser);

const filteredLegends = computed(() => {
  if (legends.value != null) {
    return legends.value.filter(
      (legend) => legend.creator === currentUser.value.id
    );
  }
  return 0;
});

const modal = ref(false);
const selectedLegend = ref(null);

const imagePreview = ref(null);
const imageSrc = ref(null);
const fileName = ref(null);
const fileInput = ref(null);

const deletePost = async (id) => {
  await appStore.deleteLegend(id);
  await appStore.getLegends();
};

const updateLegend = async () => {
  const legend = {
    title: selectedLegend.value.title,
    description: selectedLegend.value.description,
    id: selectedLegend.value.id,
    cover: imageSrc.value,
  };
  await appStore.updateLegend(legend);
  await appStore.getLegends();
  modal.value = false;
};

const openModal = (legend) => {
  selectedLegend.value = { ...legend };
  modal.value = true;
};
const closeModal = () => {
  selectedLegend.value = null;
  modal.value = false;
};

const animateLines = () => {
  const linesElements = gsap.utils.toArray(".card-items");
  const tl = gsap.timeline({ delay: 0.5 });

  linesElements.forEach((element, index) => {
    const animation = gsap.timeline();

    animation.from(
      element,
      { opacity: 0, scale: 0, duration: 0.5 },
      index * 0.1
    );

    tl.add(animation, 0); // Adding animation to the main timeline without delay
  });
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  imageSrc.value = file;
  fileName.value = file.name;
  imagePreview.value = URL.createObjectURL(file);
};

onMounted(async () => {
  await appStore.getLegends();
  animateLines();
});
</script>

<style scoped>
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  max-width: 1250px;
  margin: 150px auto;
  padding: 20px;
  gap: 20px;
  overflow-wrap: break-word;
}
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  max-width: 1250px;
  margin: 150px auto;
  padding: 20px;
  gap: 20px;
  overflow-wrap: break-word;
}

.nft {
  user-select: none;
  max-width: 300px;
  margin: 5rem auto;
  border: 1px solid rgba(255, 255, 255, 0.133);
  background-color: #282c34;
  background: linear-gradient(
    0deg,
    rgb(218 0 127) 0%,
    rgba(17, 0, 32, 0.5) 100%
  );

  box-shadow: 0 7px 20px 5px rgba(0, 0, 0, 0.533);
  border-radius: 0.7rem;
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  overflow: hidden;
  transition: 0.5s all;
}

.nft hr {
  width: 100%;
  border: none;
  border-bottom: 1px solid rgba(136, 136, 136, 0.333);
  margin-top: 0;
}

.nft ins {
  text-decoration: none;
}

.nft .main {
  display: flex;
  flex-direction: column;
  width: 90%;
  padding: 1rem;
}

.nft .main .tokenImage {
  border-radius: 0.5rem;
  max-width: 100%;
  height: 250px;
  object-fit: cover;
}

.nft .main .description {
  margin: 0.5rem 0;
  color: #a89ec9;
}

.nft .main .tokenInfo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nft .main .tokenInfo .price {
  display: flex;
  align-items: center;
  color: #ee83e5;
  font-weight: 700;
}

.nft .main .tokenInfo .price ins {
  margin-left: -0.3rem;
  margin-right: 0.5rem;
}

.nft .main .tokenInfo .duration {
  display: flex;
  align-items: center;
  color: #a89ec9;
  margin-right: 0.2rem;
}

.nft .main .tokenInfo .duration ins {
  margin: 0.5rem;
  margin-bottom: 0.4rem;
}

.nft .main .creator {
  display: flex;
  align-items: center;
  margin-top: 0.2rem;
  margin-bottom: -0.3rem;
}

.nft .main .creator ins {
  color: #a89ec9;
  text-decoration: none;
}

.nft .main .creator .wrapper {
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.133);
  padding: 0.3rem;
  margin: 0;
  margin-right: 0.5rem;
  border-radius: 100%;
  box-shadow: inset 0 0 0 4px rgba(0, 0, 0, 0.667);
}

.nft .main .creator .wrapper img {
  border-radius: 100%;
  border: 1px solid rgba(255, 255, 255, 0.133);
  width: 2rem;
  height: 2rem;
  object-fit: cover;
  margin: 0;
}

.nft::before {
  position: fixed;
  content: "";
  box-shadow: 0 0 100px 40px rgba(255, 255, 255, 0.033);
  top: -10%;
  left: -100%;
  transform: rotate(-45deg);
  height: 60rem;
  transition: 0.7s all;
}

.nft:hover {
  border: 1px solid rgba(255, 255, 255, 0.267);
  box-shadow: 0 7px 50px 10px rgba(0, 0, 0, 0.667);
  transform: scale(1.015);
  filter: brightness(1.3);
}

.nft:hover::before {
  filter: brightness(0.5);
  top: -100%;
  left: 200%;
}

.edit__button {
  background-color: #2596be;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 9px;
  width: 100%;
  font-size: 18px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease;
}

.edit__button:hover {
  background-color: #10aae2;
}

.delete__button {
  background-color: #b30c0c;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 9px;
  width: 100%;
  font-size: 18px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease;
}

.delete__button:hover {
  background-color: #e41313;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #00000070;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal__wrapper {
  background-color: #ffffffa8;
  width: 400px;
  height: auto;
  max-width: 90%;
  padding: 30px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
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
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
  object-fit: cover;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.x {
  filter: grayscale(1);
  border: none;
  background: none;
  transition: ease filter, transform 0.3s;
  cursor: pointer;
  transform-origin: center;
  position: absolute;
  top: 15px;
  right: 10px;
}
.x:hover {
  filter: grayscale(0);
  transform: scale(1.1);
}
.modalimage {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
  object-fit: cover;
  margin-top: 10px;
}
</style>

<template>
  <div class="card-list" v-if="legends">
    <div class="card-items" v-for="legend in legends" :key="legend.id">
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
          <div class="creator" @click="toUser(legend)">
            <div class="wrapper">
              <img
                :src="
                  legend.creator_avatar
                    ? legend.creator_avatar
                    : require('../assets/images/placeholder.png')
                "
                alt="Creator"
              />
            </div>
            <p><ins>Author</ins> {{ legend.creator_username }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/store/app";
import { computed, onMounted } from "vue";
import gsap from "gsap";
import router from "@/router";
const appStore = useAppStore();
const legends = computed(() => appStore.getAllLegends);

const toUser = (legend) => {
  router.push(`/profile/${legend.creator}`);
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

    tl.add(animation, 0);
  });
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
  cursor: pointer;
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
</style>

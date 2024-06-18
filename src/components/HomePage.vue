<template>
  <div class="card-list">
    <div class="card-item" v-for="legend in legends" :key="legend.id">
      <span class="developer">{{ legend.title }}</span>
      <p class="flop__description">{{ legend.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/store/app";
import { computed, onMounted } from "vue";
import gsap from "gsap";
const appStore = useAppStore();

const legends = computed(() => appStore.getAllLegends);

const animateLines = () => {
  const linesElements = gsap.utils.toArray(".card-item");
  const tl = gsap.timeline({ delay: 0.5 });

  linesElements.forEach((element, index) => {
    const animation = gsap.timeline();

    animation.from(
      element,
      { opacity: 0, scale: 0, duration: 0.5 },
      index * 0.1
    );

    tl.add(animation, 0); // Добавляем анимацию в основную таймлайн без задержки
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
.card-list .card-item {
  background: #fff;
  padding: 26px;
  border-radius: 8px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.04);
  list-style: none;
  cursor: pointer;
  text-decoration: none;
  border: 2px solid transparent;
  transition: border 0.5s ease;
}
.card-list .card-item:hover {
  border: 2px solid #000;
}
.card-list .card-item img {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  object-fit: cover;
}
.card-list span {
  display: inline-block;
  background: #f7dff5;
  margin-top: 32px;
  padding: 8px 15px;
  font-size: 18px;
  border-radius: 50px;
  font-weight: 600;
}
.flop__description {
  overflow-wrap: break-word;
}
.developer {
  font-size: 18px;
}
</style>

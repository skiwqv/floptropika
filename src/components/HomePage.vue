<template>
  <div class="wrapper">
    <div class="text">ТЫ ШЛЮХА!!</div>
    <img
      ref="image"
      src="../assets/images/jiafei.png"
      alt="image"
      class="image"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

const image = ref(null);

const anim = () => {
  gsap.to(image.value, {
    repeat: -1,
    yoyo: true,
    scaleY: -1.3,
    y: 100,
    rotation: 360,
    x: -190,
    duration: 1,
  });
};
onMounted(() => {
  anim();
});
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.text {
  font-size: 90px;
  color: white;
}
.image {
  width: 300px;
  height: auto;
}
</style>

<template>
  <div>ШЛЮХА!!</div>
  <img
    src="../assets/images/jiafei.png"
    alt="jiafei image"
    class="image"
    ref="jiafei"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";
const jiafei = ref("jiafei");
const anim = () => {
  gsap.to(jiafei.value, { repeat: -1, rotation: 360 });
};

onMounted(() => {
  anim();
});
</script>

<style>
.image {
  margin-top: 200px;
  max-width: 400px;
  max-height: 400px;
}
</style>

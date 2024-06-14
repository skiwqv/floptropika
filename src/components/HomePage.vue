<template>
  <div ref="text">ВЫ ЗАБЛОКИРОВАНЫ!!!</div>
  <img
    src="../assets/images/dula.png"
    alt="jiafei image"
    class="image"
    ref="jiafei"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";
// import apiClient from "../api.js";
const jiafei = ref("jiafei");
const text = ref("text");
const anim = () => {
  gsap.to(jiafei.value, {
    repeat: -1,
    scaleY: -2,
    scaleX: 1,
    rotate: 190,
    duration: 1,
    yoyo: true,
  });
  gsap.set(text.value, {
    repeat: -1,
    scaleY: 4,
    scaleX: 2,
    rotate: 23,
    y: 90,
  });
};

onMounted(() => {
  anim();
  // apiClient.get();
});
</script>

<style>
.image {
  margin-top: 200px;
  max-width: 400px;
  max-height: 400px;
}
</style>

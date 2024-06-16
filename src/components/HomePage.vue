<template>
  <div>{{ currentUser }}</div>
</template>

<script setup>
import { useAppStore } from "@/store/app";
import { computed } from "vue";
const appStore = useAppStore();

const currentUser = computed(() => appStore.getUser);
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

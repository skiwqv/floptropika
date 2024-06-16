<template>
  <Header></Header>
  <router-view />
</template>

<script setup>
import { useAppStore } from "@/store/app";
import { onMounted } from "vue";
const appStore = useAppStore();

onMounted(async () => {
  await appStore.getCurrentUser();
});

import Header from "@/components/HeaderMain.vue";
</script>

<style></style>

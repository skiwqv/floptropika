<template>
  <Loading></Loading>
  <Header></Header>
  <router-view />
</template>

<script setup>
import { useAppStore } from "@/store/app";
import { onMounted } from "vue";
import Header from "@/components/HeaderMain.vue";
import Loading from "@/components/Loading-page.vue";
const appStore = useAppStore();

onMounted(async () => {
  await appStore.getCurrentUser();
});
</script>

<style></style>

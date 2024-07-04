<template>
  <Loading></Loading>
  <Header></Header>
  <router-view></router-view>
  <Notification></Notification>
</template>

<script setup>
import { useAppStore } from "@/store/app";
import { onMounted } from "vue";
import Header from "@/components/HeaderMain.vue";
import Loading from "@/components/Loading-page.vue";
import Notification from "@/components/NotificationComp.vue";

const appStore = useAppStore();

onMounted(async () => {
  if (appStore.accessToken) {
    await appStore.getCurrentUser();
  }
});
</script>

<style></style>

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

const simulateClick = () => {
  const clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  document.documentElement.dispatchEvent(clickEvent);
};

onMounted(async () => {
  simulateClick();
  await appStore.getCurrentUser();
});
</script>

<style></style>

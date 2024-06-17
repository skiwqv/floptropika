<template>
  <div class="wrapper">
    <div class="text" v-if="currentUser">
      Hi
      <span>{{ currentUser.username }}</span>
    </div>
  </div>
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
  text-align: center;
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

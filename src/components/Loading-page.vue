<template>
  <div v-if="isLoading" class="loading-overlay">
    <img src="../assets/images/jiafei.png" alt="Loading..." class="spinner" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/store/app";

const appStore = useAppStore();
const isLoading = computed(() => appStore.isLoading);
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}

.spinner {
  width: 100px;
  height: 100px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

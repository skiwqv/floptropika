<template>
  <div>{{ dataFromBase }}</div>
</template>

<script setup>
import apiClient from "@/api";
import { ref, onMounted } from "vue";
const dataFromBase = ref(null);

onMounted(async () => {
  const resp = await apiClient.get("");
  dataFromBase.value = resp.data;
  console.log("asdsad", dataFromBase.value);
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

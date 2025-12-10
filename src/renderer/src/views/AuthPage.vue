<template>
  <div class="auth-page">
    <Operations />
    <div class="flex flex-col items-center">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import Operations from '@renderer/components/Operations.vue'
</script>

<style scoped>
.auth-page {
  height: 100vh;
  overflow: hidden;
  font-family: 'Maple Mono';
  background-image: url('../assets/wavy-lines.svg');
  background-size: cover;
}
</style>

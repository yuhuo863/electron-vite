<template>
  <div class="flex flex-col ispace-y-5">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">数据面板</h2>
      </div>

      <div>=-=</div>
    </div>
    <el-divider content-position="left">分析您当前账户的数据存储</el-divider>

    <div>
      {{ `当前网络状态：${isOnline ? 'online' : 'offline'}` }}
    </div>
    <RatingModal />
  </div>
</template>

<script setup lang="ts">
import { useOnline } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import RatingModal from '@renderer/components/RatingModal.vue'

const isOnline = useOnline()

onMounted(async () => {})
</script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
.el-card {
  background-color: azure;
}
</style>

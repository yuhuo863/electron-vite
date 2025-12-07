<script setup lang="ts">
import { onMounted } from 'vue'
import DynamicBreadcrumb from './components/DynamicBreadcrumb.vue'
import { useSystemStore } from '@renderer/stores/system'

const systemStore = useSystemStore()
onMounted(async () => {
  await systemStore.getUserActionLogs()
})
</script>

<template>
  <div>
    <DynamicBreadcrumb />
    <div class="pt5">
      <el-table :data="systemStore.userActionLogs">
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="details">
              {{ row.details }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="Action" width="220" align="center" />
        <el-table-column prop="timestamp" label="Timestamp" align="center" />
      </el-table>
    </div>
  </div>
</template>

<style lang="css" scoped></style>

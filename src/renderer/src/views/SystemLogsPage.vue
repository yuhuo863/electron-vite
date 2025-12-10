<script setup lang="ts">
import { useSystemStore } from '@renderer/stores/system'
import DynamicBreadcrumb from '@renderer/views/components/DynamicBreadcrumb.vue'
import { onMounted } from 'vue'
import Pagination from '@renderer/components/Pagination.vue'

const systemStore = useSystemStore()
onMounted(async () => {
  await systemStore.getApiRuntimeLogs()
})
const handleCurrentChange = async (page: number): Promise<void> => {
  systemStore.currentPage = page
  await systemStore.getApiRuntimeLogs()
}
</script>

<template>
  <div>
    <DynamicBreadcrumb />
    <div class="pt5">
      <el-table :data="systemStore.apiRuntimeLogs" max-height="400">
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-descriptions title="" direction="vertical" :column="2" border>
              <el-descriptions-item label="Service" align="center" :width="200">{{
                row.meta.service
              }}</el-descriptions-item>
              <el-descriptions-item label="Stack">
                {{ row.meta.stack }}
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="Level" align="center" width="100" />
        <el-table-column prop="message" label="Message" align="center" />

        <el-table-column prop="timestamp" label="Timestamp" align="center" />
      </el-table>
    </div>
    <Pagination
      :total="systemStore.total"
      :current-page="systemStore.currentPage"
      :page-size="systemStore.pageSize"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="css" scoped></style>

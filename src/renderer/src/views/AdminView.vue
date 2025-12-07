<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleToUserManage = (): void => {
  router.push('/admin/users')
}

const handleToSystemMonitor = (): void => {
  router.push('/admin/monitor')
}

const handleToSecurityLogs = (): void => {
  router.push('/admin/actionlogs')
}

const handleToSystemLogs = (): void => {
  router.push('/admin/systemlogs')
}
</script>

<template>
  <div class="space-y-2">
    <div @click="handleToUserManage">
      <el-card shadow="hover" class="cursor-pointer">
        <div class="flex items-center">
          <el-icon><User /></el-icon>
          <span class="ml-2">用户管理</span>
        </div>
      </el-card>
    </div>
    <div @click="handleToSystemMonitor">
      <el-card shadow="hover" class="cursor-pointer">
        <div class="flex items-center">
          <el-icon><Monitor /></el-icon>
          <span class="ml-2">系统监控</span>
        </div>
      </el-card>
    </div>
    <div @click="handleToSecurityLogs">
      <el-card shadow="hover" class="cursor-pointer">
        <div class="flex items-center">
          <el-icon><Operation /></el-icon>
          <span class="ml-2">用户操作日志</span>
        </div>
      </el-card>
    </div>
    <div @click="handleToSystemLogs">
      <el-card shadow="hover" class="cursor-pointer">
        <div class="flex items-center">
          <el-icon><SetUp /></el-icon>
          <span class="ml-2">系统运行日志</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="css" scoped></style>

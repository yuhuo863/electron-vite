<template>
  <div>
    <h3 class="font-bold">外观设置</h3>
    <div class="flex flex-col space-y-5">
      <el-card shadow="never" class="mt-3">
        <label>应用主题</label>
        <p class="text-gray-400 text-xs mt2">选择您偏好的整体配色方案。</p>
        <el-radio-group v-model="activeTheme" text-color="#000" class="mt-3">
          <el-radio-button value="light">
            <div class="flex flex-col space-y-3 p4">
              <p>
                <el-icon color="yellow" :size="32"><Sunny /></el-icon>
              </p>
              <p><span>浅色模式</span></p>
            </div>
          </el-radio-button>
          <el-radio-button value="dark">
            <div class="flex flex-col space-y-3 p4">
              <p>
                <el-icon color="skyblue" :size="32"><Moon /></el-icon>
              </p>
              <p><span>深色模式</span></p>
            </div>
          </el-radio-button>
        </el-radio-group>
      </el-card>
      <el-card shadow="never">
        <div class="flex flex-col space-y-2">
          <label>侧边栏</label>
          <p class="text-gray-400 text-xs">控制侧边栏展开或收起。</p>
          <el-switch v-model="sidebarCollapsed" @change="appStore.changeAsideWidth()"></el-switch>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAppStore } from '@renderer/stores/app'
import { useDark } from '@vueuse/core'
import storage from '@renderer/utils/storage'
import { THEME_STORAGE_KEY } from '@renderer/constants/commonVars'
import { supportsViewTransitions } from '@renderer/utils/theme-loader'

const appStore = useAppStore()
const isDark = useDark()

// useDark 此时已经读取了通过 document.documentElement 设置的主题
const activeTheme = ref(isDark.value ? 'dark' : 'light')
const sidebarCollapsed = ref(appStore.asideWidth === '180px')

watch(
  activeTheme,
  async (newValue) => {
    const updateTheme = (): void => {
      if (newValue === 'light') {
        isDark.value = false
      } else if (newValue === 'dark') {
        isDark.value = true
      }
    }
    await storage.set(THEME_STORAGE_KEY, newValue)
    if (supportsViewTransitions()) {
      document.startViewTransition(() => {
        updateTheme()
      })
    } else {
      updateTheme()
    }
  }
  // 只需要在用户点击按钮选择主题时才执行主题切换逻辑,
  // activeTheme 已经通过 isDark.value 正确初始化, 所以不需要 { immediate: true }
  // { immediate: true }
)
</script>

<style scoped>
.el-radio-group {
  gap: 1rem;
}

:deep(.el-radio-button:first-child .el-radio-button__inner),
:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 10px;
}
.el-radio-button {
  --el-radio-button-checked-border-color: #409eff;
}
</style>

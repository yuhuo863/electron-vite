<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <el-container class="flex flex-col h-full">
      <el-header class="z-300">
        <HeaderView />
      </el-header>
      <el-container class="flex-1 overflow-hidden">
        <el-aside :width="appStore.asideWidth" class="transition-all transition-duration-200">
          <AsideView />
        </el-aside>
        <el-main class="main-content no-drag">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
    <RatingModal :dialog-visible="isVisible" @update:dialog-visible="isVisible = $event" />
  </div>
</template>

<script setup lang="ts">
import user from '@renderer/api/user'
import AsideView from '@renderer/layouts/AsideView.vue'
import HeaderView from '@renderer/layouts/HeaderView.vue'
import { useAppStore } from '@renderer/stores/app'
import { useTimeoutFn } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import RatingModal from '@renderer/components/RatingModal.vue'
import { useFeedbackStatus } from '@renderer/hooks/useFeedbackStatus'
import { useAuthStore } from '@renderer/stores/auth'

const appStore = useAppStore()
const authStore = useAuthStore()

const FRONTEND_COOLDOWN_DAYS = 7 // 前端缓存冷却期 (天)

const isVisible = ref(false)

const { isLocalStorageExpired, updateLocalStorage } = useFeedbackStatus(
  authStore.userInfo?.id as string
)
const checkStatusAndSetCache = async (): Promise<void> => {
  try {
    const response = await user.checkCanRate()
    const shouldShow = response.data.should_show

    // 新用户免打扰期(7天) 或 周期性评分期(180天) 已过
    if (shouldShow) {
      isVisible.value = true
    } else {
      // 反之前端7天内不在请求该接口
      await updateLocalStorage(FRONTEND_COOLDOWN_DAYS)
    }
  } catch (error) {
    console.error('Failed to fetch feedback status:', error)
    // 接口失败：设置 1 天缓存，避免频繁重试
    await updateLocalStorage(1)
  }
}
onMounted(async () => {
  if (!(await isLocalStorageExpired())) {
    // console.log("Hit LocalStorage cache, skipping API call.");
    return
  }
  useTimeoutFn(async () => await checkStatusAndSetCache(), 3000)
})
</script>

<style scoped>
.el-header {
  padding: 0; /**去除默认样式*/
  height: 10vh;
}
/* 主内容区域滚动容器基础样式 */
.main-content {
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  scrollbar-gutter: stable both-edges;
  scrollbar-width: thin; /* 滚动条宽度：auto/thin/none */
  overflow: auto;
}

/* webkit内核浏览器（Chrome/Safari）的滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度（thin对应的值） */
  height: 6px;
}

.main-content::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb); /* 滑块颜色 */
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-track {
  background-color: var(--scrollbar-track); /* 轨道颜色 */
}

/** hover状态增强（明暗主题下均生效） */
.main-content::-webkit-scrollbar-thumb:hover {
  background-color: color-mix(in srgb, var(--scrollbar-thumb), black 10%); /* 加深10% */
}
</style>

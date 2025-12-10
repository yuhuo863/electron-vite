<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from './stores/app'
import LockScreen from './components/LockScreen.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const route = useRoute()

const handleResize = (newPath: string): void => {
  const isLoginPage =
    newPath === '/auth' || newPath === '/auth/register' || newPath === '/auth/forgot-password'
  // 向 Electron 主进程发送窗口调整指令
  window.authAPI.windowResize({
    width: isLoginPage ? 500 : 1000,
    height: isLoginPage ? 500 : 700,
    resizable: !isLoginPage
  })
}
watch(
  () => route.path,
  (newPath, oldPath) => {
    // 检查新的路径是否是登录页
    const isNewLogin =
      newPath === '/auth' || newPath === '/auth/register' || newPath === '/auth/forgot-password'
    // 检查旧的路径是否是登录页
    const wasOldLogin =
      oldPath === '/auth' || oldPath === '/auth/register' || oldPath === '/auth/forgot-password'

    // 判断是否是首次初始化(未退出登录,尝试恢复登录态)
    const isInit = oldPath === undefined
    // 只有当登录状态发生切换时才触发窗口调整
    // A. 首次初始化 (无论当前在什么页面，都要根据当前页面设置一次大小)
    //    OR
    // B. 登录状态发生切换 (从登录页变为主页，或反之)
    if (isInit || isNewLogin !== wasOldLogin) {
      handleResize(newPath)
    }
  },
  { immediate: true } // 立即执行一次（应用启动时初始化窗口大小）
)

const appStore = useAppStore()
</script>

<template>
  <el-config-provider :locale="zhCn">
    <template v-if="appStore.isStateReady">
      <RouterView />

      <Teleport to="body">
        <Transition name="fade">
          <LockScreen v-if="appStore.isScreenLocked" />
        </Transition>
      </Teleport>
    </template>

    <div v-else class="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-black">
      <el-icon class="is-loading" :size="30" color="#409EFF">
        <Loading />
      </el-icon>
      <span class="ml-2 text-gray-500 dark:text-gray-400">正在加载配置...</span>
    </div>
  </el-config-provider>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

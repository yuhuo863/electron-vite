import { LOCK_SCREEN_KEY } from '@renderer/constants/commonVars'
import storage from '@renderer/utils/storage'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isCollapse = ref(false)
  const asideWidth = ref('180px')

  const toggleCollapse = (): void => {
    isCollapse.value = !isCollapse.value
  }

  const changeAsideWidth = (): void => {
    asideWidth.value = asideWidth.value === '180px' ? '64px' : '180px'
  }

  // 持久化状态是否已加载
  const isStateReady = ref(false)
  // 锁屏状态
  const isScreenLocked = ref(false)

  // 初始化锁屏状态
  storage
    .get(LOCK_SCREEN_KEY)
    .then((value) => {
      isScreenLocked.value = !!value

      // 状态加载完成后，将标志设为 true
      isStateReady.value = true
    })
    .catch(() => {
      // 状态加载失败时，同样将标志设为 true
      isStateReady.value = true
    })

  // 监听锁屏状态变化，保存到本地存储
  watch(isScreenLocked, (newVal) => {
    storage.set(LOCK_SCREEN_KEY, newVal)
  })

  // 锁定屏幕
  const lockScreen = (): void => {
    isScreenLocked.value = true
  }

  // 解锁屏幕
  const unlockScreen = (): void => {
    isScreenLocked.value = false
  }

  return {
    isCollapse,
    asideWidth,
    toggleCollapse,
    changeAsideWidth,
    isStateReady,
    isScreenLocked,
    lockScreen,
    unlockScreen
  }
})

import { ref, onMounted, onUnmounted, Ref } from 'vue'
import { FeedbackCache } from '@renderer/types/feedback'
import user from '@renderer/api/user'

const FEEDBACK_STORAGE_KEY = 'app_feedback_check'
const DELAY_CALL_SECONDS = 3 // 延迟调用时间 (秒)
const FRONTEND_COOLDOWN_DAYS = 7 // 前端缓存冷却期 (天)
/**
 * 更新本地存储标记 (设置短期前端缓存)
 */
function updateLocalStorage(daysUntilNextCheck: number): void {
  const safeDays = Math.max(1, daysUntilNextCheck)
  const nextCheckTimestamp = new Date().getTime() + safeDays * 24 * 60 * 60 * 1000
  const data: FeedbackCache = {
    nextCheckTimestamp: nextCheckTimestamp
  }
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(data))
}

/**
 * 检查本地存储标记是否已过期
 */
function isLocalStorageExpired(): boolean {
  const data = localStorage.getItem(FEEDBACK_STORAGE_KEY)
  if (!data) return true

  try {
    const stored: FeedbackCache = JSON.parse(data)
    const now = new Date().getTime()

    // 确保 nextCheckTimestamp 是有效的数字，并且判断是否过期
    return typeof stored.nextCheckTimestamp !== 'number' || now > stored.nextCheckTimestamp
  } catch (e) {
    console.error('Local Storage parsing failed:', e)
    return true
  }
}

export function useFeedbackStatus(): {
  isFeedbackModalVisible: Ref<boolean>
  handleRatingSubmittedSuccess: () => void
  closeModalManually: () => void
} {
  const isFeedbackModalVisible: Ref<boolean> = ref(false)
  let timer: number | null = null

  const checkStatusAndSetCache = async (): Promise<void> => {
    try {
      // 使用泛型 AxiosResponse<T> 明确指定响应数据结构
      const response = await user.checkCanRate()
      const shouldShow = response.data.should_show

      if (shouldShow) {
        isFeedbackModalVisible.value = true
      } else {
        updateLocalStorage(FRONTEND_COOLDOWN_DAYS)
      }
    } catch (error) {
      console.error('Failed to fetch feedback status:', error)
      // 接口失败：设置 1 天缓存，避免频繁重试
      updateLocalStorage(1)
    }
  }

  // B. 评分提交成功后调用
  const handleRatingSubmittedSuccess = (): void => {
    isFeedbackModalVisible.value = false
    // 提交成功，设置短期缓存，后端会在 180 天内处理长期冷却
    updateLocalStorage(FRONTEND_COOLDOWN_DAYS)
  }

  // C. 用户手动关闭弹窗
  const closeModalManually = (): void => {
    isFeedbackModalVisible.value = false
    // 用户手动关闭，设置 1 天缓存，避免第二天再次弹出
    updateLocalStorage(1)
  }

  // D. 生命周期控制：触发时机
  onMounted(() => {
    // 1. 检查本地存储，实现懒调用
    if (!isLocalStorageExpired()) {
      // console.log("Hit LocalStorage cache, skipping API call.");
      return
    }

    // 2. 缓存过期 -> 触发延迟调用 (登录后延迟 3 秒)
    timer = window.setTimeout(() => {
      checkStatusAndSetCache()
    }, DELAY_CALL_SECONDS * 1000)
  })

  // E. 清理定时器
  onUnmounted(() => {
    if (timer !== null) {
      window.clearTimeout(timer)
    }
  })

  return {
    isFeedbackModalVisible,
    handleRatingSubmittedSuccess,
    closeModalManually
  }
}

import { FeedbackCache } from '@renderer/types/feedback'
import storage from '@renderer/utils/storage'

const FEEDBACK_STORAGE_KEY_PREFIX = 'app_feedback_check'

export const useFeedbackStatus = (
  userId: string
): {
  isLocalStorageExpired: () => Promise<boolean>
  updateLocalStorage: (daysUntilNextCheck: number) => Promise<void>
} => {
  const USER_SPECIFIC_KEY = `${FEEDBACK_STORAGE_KEY_PREFIX}${userId}`

  const isLocalStorageExpired = async (): Promise<boolean> => {
    const data = await storage.get(USER_SPECIFIC_KEY)
    if (!data) return true

    try {
      const stored: FeedbackCache = JSON.parse(data)
      const now = new Date().getTime()
      return typeof stored.nextCheckTimestamp !== 'number' || now > stored.nextCheckTimestamp
    } catch (e) {
      console.error('Local Storage parsing failed:', e)
      return true
    }
  }

  const updateLocalStorage = async (daysUntilNextCheck: number): Promise<void> => {
    const safeDays = Math.max(1, daysUntilNextCheck)
    const nextCheckTimestamp = new Date().getTime() + safeDays * 24 * 60 * 60 * 1000
    const data: FeedbackCache = {
      nextCheckTimestamp: nextCheckTimestamp
    }
    await storage.set(USER_SPECIFIC_KEY, JSON.stringify(data))
    console.log('下次检查时间为：' + new Date(nextCheckTimestamp).toLocaleString())
  }

  return {
    isLocalStorageExpired,
    updateLocalStorage
  }
}

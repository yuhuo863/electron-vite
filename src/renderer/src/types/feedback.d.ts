/**
 * 本地存储中用于性能优化的缓存数据结构
 */
export interface FeedbackCache {
  /** 下次应检查后端 API 的时间戳 (毫秒) */
  nextCheckTimestamp: number
}

/**
 * 后端 /api/feedback/status 接口返回的数据结构
 */
export interface FeedbackStatusResponse {
  status: boolean
  message: string
  data: {
    should_show: boolean
    message: string
    last_feedback_date: Date | null
  }
}

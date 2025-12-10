import storage from './storage'
import { THEME_STORAGE_KEY, DEFAULT_THEME } from '../constants/commonVars'

// 检查浏览器是否支持 startViewTransition
export const supportsViewTransitions = (): boolean => {
  return typeof document.startViewTransition === 'function'
}

/**
 * 异步加载持久化主题，并在加载完成后设置 body class
 * @returns {Promise<string>} 当前的主题 ('light' 或 'dark')
 */
export async function loadInitialTheme(): Promise<string> {
  const savedTheme = await storage.get(THEME_STORAGE_KEY)
  const themeToApply = savedTheme || DEFAULT_THEME

  // 在应用渲染前设置 body class
  // document.documentElement.setAttribute('data-theme', themeToApply)

  // element-plus 的 dark mode class
  if (themeToApply === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  return themeToApply
}

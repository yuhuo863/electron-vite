import { useAuthStore } from '@renderer/stores/auth'
import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  Router
} from 'vue-router'

let isAuthInited = false
export const createPermissionGuard = (router: Router): void => {
  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalizedLoaded,
      next: NavigationGuardNext
    ) => {
      const authStore = useAuthStore()

      // 1. 全局初始化：仅首次执行，尝试从本地存储恢复 Token
      if (!isAuthInited) {
        try {
          await authStore.initAuth()
        } catch (error) {
          console.error('Auth initialization failed:', error)
        } finally {
          isAuthInited = true
        }
      }
      // 获取当前认证状态
      // 当拦截器清除 store 状态时，isAuthenticated 会变为 false
      const isAuthenticated = authStore.userInfo && authStore.accessToken
      // 判断目标路由是否是登录页
      const isGoingToLogin = to.meta.isLoginPage || to.path === '/auth'
      // 判断目标路由是否需要认证
      const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
      try {
        // 2. 已登录的情况
        if (isAuthenticated) {
          if (isGoingToLogin) {
            // 2.1. 用户已登录，但访问登录页 -> 强制跳回原来的页面或首页
            next(from.fullPath || '/')
          } else {
            // 2.2. 用户已登录，访问受保护或普通页 -> 正常放行
            next()
          }
          return
        }
        // 3. 未登录的情况
        if (requiresAuth) {
          // 3.1. 用户未登录 (或被拦截器踢出导致状态丢失)，访问受保护页 -> 跳转到登录页
          // 拦截器在清除状态后，下一次路由导航就会命中此逻辑
          next({
            path: '/auth',
            query: { redirect: to.fullPath }, // 携带 redirect 参数，登录后自动跳回
            replace: true // 替换当前记录，避免回退到被拦截的页面
          })
        } else {
          // 3.2. 用户未登录，访问白名单页面（如 404, 注册页等） -> 正常放行
          next()
        }
      } catch (error) {
        console.error('路由守卫异常：', error)
        next({ path: '/auth' }) // 导航失败，保险起见跳转到登录页
      }
    }
  )
}

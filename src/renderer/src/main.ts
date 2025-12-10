import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { errorHandler } from './error'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/dark/css-vars.css'
import './styles/common/index.css'
import './assets/main.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { setupRouterGuard } from './router/guard'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { loadInitialTheme } from './utils/theme-loader'
import 'virtual:uno.css'

async function bootstrap(): Promise<void> {
  const initialTheme = await loadInitialTheme()
  console.log(`App initialized with theme: ${initialTheme}`)

  const app = createApp(App)
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  errorHandler(app)
  setupRouterGuard(router)
  app.use(router)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  app.use(ElementPlus, {
    size: 'default',
    zIndex: 3000
  })

  app.mount('#app')
}

bootstrap()

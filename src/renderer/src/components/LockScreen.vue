<template>
  <div
    class="fixed inset-0 z-3000 bg-[#02040a] flex flex-col items-center justify-center select-none"
  >
    <div
      class="absolute top-20 flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
      @click="handleUnlockTrigger"
    >
      <el-icon :size="24" class="text-white mb-2"><Lock /></el-icon>
      <span class="text-gray-400 text-sm tracking-widest">点击解锁</span>
    </div>

    <div class="flex items-center space-x-6">
      <div
        class="bg-[#1e2330] w-40 h-40 rounded-xl flex items-center justify-center shadow-2xl relative group"
      >
        <span class="absolute top-2 left-3 text-gray-500 text-xs font-bold tracking-wider"
          >AM/PM</span
        >
        <span
          v-if="ampm"
          class="absolute top-2 left-3 text-gray-400 text-xs font-bold tracking-wider"
          >{{ ampm }}</span
        >
        <span class="text-white text-8xl font-sans font-light">{{ hours }}</span>
      </div>

      <div class="bg-[#1e2330] w-40 h-40 rounded-xl flex items-center justify-center shadow-2xl">
        <span class="text-white text-8xl font-sans font-light">{{ minutes }}</span>
      </div>
    </div>

    <div class="mt-16 text-white text-xl tracking-widest font-light">
      {{ currentDate }}
    </div>

    <div
      class="absolute bottom-10 right-10 text-gray-500 hover:text-red-400/80 cursor-pointer transition-colors text-sm"
      @click="handleLogout"
    >
      <el-icon><SwitchButton /></el-icon>
      <span> 退出登录</span>
    </div>

    <el-dialog
      v-model="showUnlockDialog"
      title="解除锁定"
      width="300px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      align-center
      destroy-on-close
    >
      <div class="flex flex-col space-y-4">
        <p class="text-gray-500 text-sm">请输入主密码以返回应用</p>
        <el-form ref="unlockFormRef" :model="unlockForm" :rules="unlockRules" :show-message="false">
          <el-form-item label="" prop="password">
            <el-input
              v-model="unlockForm.password"
              type="password"
              placeholder="请输入主密码"
              show-password
              @keyup.enter="handleUnlock(unlockFormEl)"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <el-button @click="showUnlockDialog = false">取消</el-button>
          <el-button type="primary" :loading="verifying" @click="handleUnlock(unlockFormEl)">
            解锁
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, useTemplateRef } from 'vue'
import { useNow, useDateFormat } from '@vueuse/core'
import { useAppStore } from '@renderer/stores/app'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@renderer/stores/auth'
import { useRouter } from 'vue-router'
import user from '@renderer/api/user'
import { AxiosError } from 'axios'

const appStore = useAppStore()

const showUnlockDialog = ref(false)
const verifying = ref(false)

// --- 时间逻辑 ---
const now = useNow()
const hours = useDateFormat(now, 'HH') // 24小时制，如果图上是20，那就是HH
const minutes = useDateFormat(now, 'mm')
const currentDate = useDateFormat(now, 'YYYY-MM-DD dddd') // 2025-12-10 星期三
const ampm = useDateFormat(now, 'A') // AM/PM

// --- 解锁逻辑 ---
const unlockFormEl = useTemplateRef<FormInstance | null>('unlockFormRef')
const unlockForm = reactive({
  password: ''
})
const unlockRules = reactive<FormRules>({
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const handleUnlockTrigger = (): void => {
  showUnlockDialog.value = true
  unlockForm.password = ''
}

const handleUnlock = async (formEl: FormInstance | null): Promise<void> => {
  if (!formEl) return
  verifying.value = true

  try {
    await formEl.validate().catch(() => false)

    const isValidPassword = await user.verifyLockScreenPassword(unlockForm.password)

    if (isValidPassword.status) {
      showUnlockDialog.value = false
      appStore.unlockScreen()
      ElMessage.success('欢迎回来')
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Error unlocking:', error)
      ElMessage.error(error.response?.data?.message || 'Failed to unlock')
    }
  } finally {
    verifying.value = false
  }
}

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async (): Promise<void> => {
  try {
    // 清除锁屏状态
    appStore.unlockScreen()

    await authStore.logout()
    router.push('/auth')
  } catch (e) {
    ElMessage.error('登出出错')
    console.error('Error:', e)
  }
}
</script>

<style scoped></style>

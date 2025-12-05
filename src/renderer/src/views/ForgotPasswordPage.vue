<template>
  <div class="reset-password-container">
    <div class="reset-password-card space-y-2">
      <h2 class="text-center font-bold">重置密码</h2>
      <div>
        <el-form
          ref="codeFormRef"
          :model="form"
          :rules="codeRules"
          label-width="auto"
          hide-required-asterisk
        >
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="form.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password
              clearable
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请确认新密码"
              show-password
              clearable
            />
          </el-form-item>
          <el-form-item label="注册邮箱" prop="email">
            <el-input v-model="form.email" type="email" placeholder="请输入绑定的邮箱" clearable />
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-row :gutter="5">
              <el-col :span="14">
                <el-input v-model="form.code" placeholder="请输入6位验证码" clearable />
              </el-col>
              <el-col :span="10">
                <el-button
                  type="primary"
                  :disabled="remaining < 60"
                  class="w-22.8"
                  @click="sendCode"
                >
                  {{ remaining < 60 ? `${remaining}秒后重发` : '获取验证码' }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="default" @click="backToLogin">返回登录</el-button>
            <el-button type="primary" @click="handleResetPassword(codeFormRef)">重置密码</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCountdown } from '@vueuse/core'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { shallowRef } from 'vue'
import { reactive, useTemplateRef } from 'vue'
import userApi from '@renderer/api/user'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

const codeFormRef = useTemplateRef<FormInstance | null>('codeFormRef')

const form = reactive({
  newPassword: '',
  confirmPassword: '',
  email: '',
  code: ''
})

const codeRules = reactive<FormRules>({
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_, value) => value === form.newPassword,
      message: '两次输入的密码不一致',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码为6位数字', trigger: 'blur' }
  ]
})
const router = useRouter()
const backToLogin = (): void => {
  router.push('/auth')
}

const countdown = shallowRef(60)
const { remaining, start, reset } = useCountdown(countdown, {
  onComplete() {
    reset(countdown.value)
  },
  onTick() {
    console.log('倒计时剩余时间：', remaining.value)
  }
})

const sendCode = async (): Promise<void> => {
  if (!form.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }
  if (remaining.value === 60) {
    try {
      const response = await userApi.sendEmailCode(form.email)
      start()
      ElMessage.success(response.message)
    } catch (error) {
      if (error instanceof AxiosError) {
        ElMessage.error(error?.response?.data?.message || '发送验证码失败')
        console.error('Error sending email code', error)
      }
    }
  }
}

const handleResetPassword = async (formEl: FormInstance | null): Promise<void> => {
  if (!formEl) return
  const valid = await formEl.validate().catch(() => false)
  if (!valid) {
    ElMessage.error('请完成验证信息')
    return
  }
  try {
    const response = await userApi.verifyEmailCode(form.newPassword, form.email, form.code)
    ElMessage.success(response.message)
    backToLogin()
  } catch (error) {
    if (error instanceof AxiosError) {
      ElMessage.error(error?.response?.data?.message || '重置密码失败')
      console.error('Error resetting password', error)
    }
  }
}
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-top: 20px;
}
.reset-password-card {
  width: 100%;
  max-width: 350px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 30px 20px;
}
</style>

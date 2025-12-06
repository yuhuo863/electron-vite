<template>
  <div>
    <DynamicBreadcrumb />
    <div class="reset-password-container">
      <el-card class="reset-password-card" shadow="never">
        <div class="page-title">设置新密码</div>
        <div class="form-container">
          <el-form
            ref="passwordFormRef"
            :model="form"
            :rules="getPasswordRules"
            label-width="100px"
            :show-message="false"
          >
            <el-form-item label="当前密码" prop="currentPassword">
              <el-input
                v-model="form.currentPassword"
                type="password"
                placeholder="请输入您的当前密码"
              />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="form.newPassword"
                type="password"
                placeholder="8-20位，包含字母和数字"
                @input="checkPasswordStrength"
              />
              <div class="password-strength mt-2">
                <div class="strength-text">强度：{{ passwordStrengthText }}</div>
                <div class="strength-bars">
                  <div
                    class="strength-bar"
                    :class="passwordStrength >= 1 ? 'strength-1' : ''"
                  ></div>
                  <div
                    class="strength-bar"
                    :class="passwordStrength >= 2 ? 'strength-2' : ''"
                  ></div>
                  <div
                    class="strength-bar"
                    :class="passwordStrength >= 3 ? 'strength-3' : ''"
                  ></div>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
              />
            </el-form-item>

            <el-form-item class="form-actions">
              <el-button type="default" @click="router.push('/settings')">返回</el-button>
              <el-button type="primary" @click="submitResetPassword">提交重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import DynamicBreadcrumb from './DynamicBreadcrumb.vue'
import { useRouter } from 'vue-router'
import userApi from '@renderer/api/user'
import { AxiosError } from 'axios'
import { useAuthStore } from '@renderer/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const passwordFormRef = ref<FormInstance>()

const passwordStrength = ref(0)
const passwordStrengthText = ref('弱')

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const getPasswordRules = reactive<FormRules>({
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, message: '密码长度不少于6位', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/,
      message: '密码需8-20位，包含字母和数字',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_, value: string, callback: (error?: Error) => void) => {
        if (value !== form.newPassword) callback(new Error('两次密码不一致'))
        else callback()
      },
      trigger: 'blur'
    }
  ]
})

const checkPasswordStrength = (value: string): void => {
  let strength = 0
  if (value.length >= 8) strength++
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) strength++
  if (/[0-9]/.test(value)) strength++
  passwordStrength.value = strength
  passwordStrengthText.value = strength === 1 ? '弱' : strength === 2 ? '中' : '强'
}

const submitResetPassword = async (): Promise<void> => {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate((valid) => {
    if (!valid) {
      ElMessage.error('请检查密码输入')
      return
    }
  })
  try {
    const response = await userApi.updatePassword(form.currentPassword, form.newPassword)
    ElMessage.success(response.message)
    await authStore.clearLoginStatus()
    router.push('/auth')
  } catch (error) {
    if (error instanceof AxiosError) {
      ElMessage.error(
        error?.response?.data?.errors[0].msg || error.response?.data.message || '重置密码失败'
      )
    }
    console.error('Error updating password', error)
  }
}
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #f5f7fa;
  padding: 20px;
  margin-top: 20px;
}

.reset-password-card {
  width: 100%;
  max-width: 450px;
  /*box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);*/
  border-radius: 12px;
  padding: 30px 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 25px;
}

.form-container {
  width: 100%;
}

.desc {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
}

.method-btn {
  width: 45%;
  margin: 0 8px 15px;
  padding: 12px 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.password-strength {
  width: 100%;
}
.strength-text {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}
.strength-bars {
  display: flex;
  gap: 4px;
  height: 6px;
}
.strength-bar {
  flex: 1;
  background-color: #eee;
  border-radius: 3px;
  transition: background-color 0.3s;
}
.strength-1 {
  background-color: #ff4d4f;
}
.strength-2 {
  background-color: #faad14;
}
.strength-3 {
  background-color: #52c41a;
}

/* 成功页面样式 */
.success-container {
  padding: 20px 0;
}
.success-icon {
  font-size: 56px;
  color: #52c41a;
  margin-bottom: 15px;
}
.success-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}
.success-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

/* 响应式适配（小屏幕下按钮纵向排列） */
@media (max-width: 480px) {
  .method-btn {
    width: 100%;
    margin: 0 0 15px;
  }
  .form-actions {
    flex-direction: column;
  }
  .form-actions el-button {
    width: 100%;
  }
}
</style>

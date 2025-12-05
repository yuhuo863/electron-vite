<template>
  <div>
    <div class="reset-password-container">
      <div class="reset-password-card space-y-2">
        <h2 class="text-2xl font-bold text-center">用户注册</h2>
        <div>
          <el-form
            ref="registerFormEl"
            :model="form"
            :rules="rules"
            label-width="auto"
            hide-required-asterisk
            :show-message="false"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>

            <el-form-item label="注册邮箱" prop="email">
              <el-input v-model="form.email" type="email" placeholder="请输入邮箱" />
            </el-form-item>

            <el-form-item label="注册密码" prop="password">
              <el-input v-model="form.password" type="password" placeholder="请输入密码" />
            </el-form-item>

            <el-form-item label="验证码" prop="captchaText">
              <div class="flex gap-.5">
                <el-input v-model="form.captchaText" class="w-30" placeholder="请输入验证码" />
                <img
                  :src="captchaDataUrl"
                  title="点击刷新"
                  alt="验证码"
                  class="no-drag cursor-pointer h-9"
                  @click="getCaptcha"
                />
              </div>
            </el-form-item>

            <el-form-item label=" ">
              <div class="flex">
                <el-button type="default" @click="backToLogin">返回登录</el-button>
                <el-button type="primary" @click="handleRegister(registerFormEl)"
                  >立即注册</el-button
                >
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import auth from '@renderer/api/auth'
import { AxiosError } from 'axios'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { ref, reactive, useTemplateRef, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const registerFormEl = useTemplateRef<FormInstance | null>('registerFormEl')

const captchaDataUrl = ref<string>('')
const getCaptcha = async (): Promise<void> => {
  try {
    const response = await auth.generateCaptchaApi()
    const encodedSvg = encodeURIComponent(response.data.captcha)
    form.captchaKey = response.data.key
    captchaDataUrl.value = `data:image/svg+xml;charset=utf-8,${encodedSvg}`
  } catch (error) {
    console.error('Error fetching captcha:', error)
  }
}
onMounted(async () => {
  await getCaptcha()
})

const form = reactive({
  username: '',
  email: '',
  password: '',
  captchaKey: '',
  captchaText: ''
})
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captchaText: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})

const router = useRouter()
const backToLogin = (): void => {
  router.push('/auth')
}

const handleRegister = async (formEl: FormInstance | null): Promise<void> => {
  if (!formEl) return
  const valid = await formEl.validate().catch(() => false)
  if (!valid) {
    ElMessage.warning('请完善注册信息')
    return
  }
  try {
    const response = await auth.registerApi(form)
    ElMessage.success(response.message)
    backToLogin()
  } catch (error) {
    if (error instanceof AxiosError) {
      ElMessage.error(
        error?.response?.data?.errors[0].msg || error.response?.data.message || '未知错误'
      )
      console.error('Error registering user:', error)
    }
  }
}
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 350px;
}
.reset-password-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 30px 20px;
}
.el-input {
  height: 38px;
}
</style>

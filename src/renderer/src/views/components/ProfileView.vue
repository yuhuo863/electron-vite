<template>
  <div class="flex flex-col space-y-4">
    <el-card shadow="never" class="flex">
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="rules"
        label-width="auto"
        :show-message="false"
      >
        <el-form-item label="头像" prop="avatar">
          <div class="cursor-default">
            <el-avatar :src="userForm.avatar" fit="cover" :size="96" @error="handleAvatarError">
              <img :src="avatarFeedbackURL" alt="avatar" />
            </el-avatar>
          </div>
          <CropperItem @get-crop-img-data="getCropImgBlobData" />
        </el-form-item>
        <el-alert
          type="info"
          title="Attention:"
          description="仅限支持 WEBP、JPG、PNG、AVIF 等格式且小于 2 M"
          show-icon
          :closable="false"
        />
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-form>
      <div class="flex justify-end">
        <el-button type="primary" :loading="loading" @click="submitForm(userFormRef)"
          >更新</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import CropperItem from '@renderer/views/components/CropperItem.vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAuthStore } from '@renderer/stores/auth'
import usersApi from '@renderer/api/user'

const authStore = useAuthStore()
const { userInfo } = authStore

const loading = ref(false)
const avatarFeedbackURL = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const handleAvatarError = (): boolean => true
const blobData = ref<Blob | null>(null)
const currentImageType = ref('')
const userForm = ref<UserForm>({
  username: '',
  email: '',
  avatar: ''
})
Object.assign(userForm.value, { ...userInfo })

const getCropImgBlobData = ({ base64, blob, imgType }): void => {
  // 将base64赋值给头像字段，用于预览
  userForm.value.avatar = base64
  // 保存裁剪后的 Blob 数据
  blobData.value = blob
  // 保存裁剪后的图片类型，用于上传时确定文件类型
  currentImageType.value = imgType
}

const userFormRef = useTemplateRef<FormInstance | undefined | null>('userFormRef')
const rules = ref<FormRules<UserForm>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined | null): Promise<void> => {
  if (!formEl) return
  loading.value = true

  try {
    await formEl.validate()

    const finalUpdateData = { ...userForm.value }
    if (blobData.value) {
      const formData = new FormData()
      formData.append(
        'file',
        blobData.value as Blob,
        `avatar-${Date.now()}.${currentImageType.value}`
      )
      const response = await usersApi.uploadAvatar(formData)
      const newAvatarUrl = response.data.file.url

      finalUpdateData.avatar = newAvatarUrl
    }

    const res = await usersApi.updateProfile(finalUpdateData)
    authStore.updateUserInfo({ ...res.data.updatedUser })
    ElMessage.success(res.message)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:deep(.vue-cropper) {
  background: #f5f5f5;
  border-radius: 8px;
  min-height: 400px;
}
:deep(.el-form-item:first-child) {
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-alert {
  margin: 0 0 20px 40px;
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 1px 2px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>

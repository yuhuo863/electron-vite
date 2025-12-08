<template>
  <div class="flex flex-col">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">所有密码</h2>
      </div>

      <div><el-button type="primary" plain @click="openDrawer(false)"> 新建密码</el-button></div>
      <el-drawer
        v-model="drawerVisible"
        :title="isEditMode ? '编辑密码' : '新建密码'"
        direction="rtl"
        size="40%"
        :destroy-on-close="true"
        :resizable="true"
      >
        <el-form
          ref="drawerFormEl"
          :model="drawerForm"
          :rules="rules"
          label-position="top"
          label-width="auto"
          :show-message="false"
        >
          <el-form-item label="分类">
            <el-select v-model="currentCategoryId" placeholder="默认分类" clearable>
              <el-option
                v-for="category in categoryStore.categoryList"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="名称" prop="title">
            <el-input v-model="drawerForm.title" />
          </el-form-item>

          <el-form-item label="用户名" prop="username">
            <el-input v-model="drawerForm.username" />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="drawerForm.password" show-password> </el-input>
          </el-form-item>

          <el-form-item label="URL" prop="url">
            <el-input v-model="drawerForm.url" />
          </el-form-item>

          <el-form-item label="备注" prop="notes">
            <el-input v-model="drawerForm.notes" type="textarea" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="drawer-footer">
            <el-button @click="drawerVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit(drawerFormEl)">
              {{ isEditMode ? '更新' : '提交' }}
            </el-button>
          </div>
        </template>
      </el-drawer>
    </div>

    <el-divider content-position="left">管理和查看您存储的所有密码</el-divider>

    <div>
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@renderer/stores/category'
import { usePwdStore } from '@renderer/stores/password'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { ref, useTemplateRef, reactive } from 'vue'

const pwdStore = usePwdStore()
const categoryStore = useCategoryStore()

const drawerVisible = ref(false)
const isEditMode = ref(false)
const drawerFormEl = useTemplateRef<FormInstance | null>('drawerFormEl')
const drawerForm = ref({
  id: '',
  title: '',
  username: '',
  password: '',
  url: '',
  notes: ''
})
const currentCategoryId = ref('')
const rules = reactive<FormRules<PasswordForm>>({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  url: [{ required: false }],
  notes: [{ required: false }]
})
const openDrawer = async (passwordItem): Promise<void> => {
  if (passwordItem) {
    isEditMode.value = true
    drawerForm.value = { ...passwordItem }
    currentCategoryId.value = passwordItem.category.id
  } else {
    isEditMode.value = false
    drawerForm.value = {
      id: '',
      title: '',
      username: '',
      password: '',
      url: '',
      notes: ''
    }
    currentCategoryId.value = ''
  }
  drawerVisible.value = true
}
const handleSubmit = (formEl: FormInstance | null): void => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        if (isEditMode.value) {
          await pwdStore.updatePassword(drawerForm.value.id, {
            ...drawerForm.value,
            categoryId: currentCategoryId.value
          })
          ElMessage.success('更新成功')
        } else {
          await pwdStore.createPassword(drawerForm.value)
          ElMessage.success('创建成功')
        }
      } catch (error) {
        ElMessage.error('保存失败')
        console.error(error)
      } finally {
        drawerVisible.value = false
      }
    }
  })
}
</script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}
</style>

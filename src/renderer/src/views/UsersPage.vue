<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import DynamicBreadcrumb from './components/DynamicBreadcrumb.vue'
import { useUserStore } from '@renderer/stores/user'
import { ElMessage, FormInstance } from 'element-plus'
const userStore = useUserStore()

onMounted(async () => {
  await userStore.getUserList()
})
const roleOptions = [
  { text: 'admin', value: 'admin' },
  { text: 'user', value: 'user' },
  { text: 'vip', value: 'vip' }
]
const filterRole = (value: string, row): boolean => {
  return row.role === value
}

const handleActiveChange = async (row): Promise<void> => {
  await userStore.handleActiveChange(row)
}

const openDialog = (row): void => {
  dialogFormVisible.value = true
  dialogFormModel.value = row
}

const dialogFormVisible = ref(false)
const dialogFormModel = ref({
  role: '',
  reason: ''
})
const dialogFormEl = useTemplateRef<FormInstance | null>('dialogFormEl')
const handleUpdateRole = async (formEl: FormInstance | null): Promise<void> => {
  if (!formEl) return
  const valid = await formEl?.validate().catch(() => false)
  if (!valid) return
  try {
    await userStore.handleRoleChange(
      dialogFormModel.value.id,
      dialogFormModel.value.role,
      dialogFormModel.value.reason
    )
  } catch (error) {
    ElMessage.error('更新角色失败')
    console.error('Error updating role:', error)
  } finally {
    dialogFormVisible.value = false
  }
}
const resetForm = (): void => {
  dialogFormEl.value?.resetFields()
}
</script>

<template>
  <div>
    <DynamicBreadcrumb />
    <div class="mt5">
      <el-table
        :data="userStore.userList"
        height="400"
        max-height="400"
        :header-cell-style="{ backgroundColor: '#f2f2f2', color: '#333333' }"
      >
        <el-table-column fixed prop="username" label="Username" width="180" align="center" />
        <el-table-column prop="email" label="Email" width="150" align="center" />
        <el-table-column
          prop="role"
          label="Role"
          width="180"
          align="center"
          :filters="roleOptions"
          :filter-method="filterRole"
        />
        <el-table-column prop="isActive" label="Active" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.isActive"
              :disabled="row.role === 'admin'"
              @change="handleActiveChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="Last Login" width="180" align="center">
          <template #default="{ row }">
            {{ row.lastLogin ? row.lastLogin : 'Never' }}
          </template>
        </el-table-column>
        <el-table-column prop="lockedUntil" label="Locked Until" width="180" align="center">
          <template #default="{ row }">
            {{ row.lockedUntil ? row.lockedUntil : 'Not Locked' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="passwordCount"
          label="Password Count"
          width="180"
          align="center"
          sortable
        />
        <el-table-column
          prop="masterPasswordHint"
          label="Master Password Hint"
          width="200"
          align="center"
        >
          <template #default="{ row }">
            {{ row.masterPasswordHint || 'None' }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Created At" width="180" align="center" />
        <el-table-column prop="updatedAt" label="Updated At" width="180" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="primary" text icon="EditPen" @click="openDialog(row)"
              >更新角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-model="dialogFormVisible"
      title="更新用户角色"
      destroy-on-close
      top="30vh"
      @closed="resetForm"
    >
      <el-form ref="dialogFormEl" :model="dialogFormModel" label-width="120px">
        <el-form-item label="角色" prop="role">
          <el-select v-model="dialogFormModel.role" placeholder="请选择角色">
            <el-option label="VIP用户" value="vip" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作原因" prop="reason">
          <el-input
            v-model="dialogFormModel.reason"
            type="textarea"
            placeholder="请输入操作原因(可选)"
            :rows="5"
            resize="none"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateRole(dialogFormEl)">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="css" scoped></style>

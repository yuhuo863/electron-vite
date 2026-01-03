import admin from '@renderer/api/admin'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userList = ref<IUserItem[]>([])

  const getUserList = async (): Promise<void> => {
    try {
      const response = await admin.getUserList()
      userList.value = response.data.users
    } catch (error) {
      console.error('Failed to fetch user list:', error)
    }
  }

  const handleActiveChange = async (row: IUserItem): Promise<void> => {
    try {
      const response = await admin.updateUserStatus(row.id, row.isActive)
      await getUserList()
      ElMessage.success(response.message)
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  const handleRoleChange = async (id: string, role: string, reason?: string): Promise<void> => {
    try {
      const response = await admin.updateUserRole(id, role, reason)
      await getUserList()
      ElMessage.success(response.message)
    } catch (error) {
      console.error('Failed to update user role:', error)
    }
  }

  return {
    userList,
    getUserList,
    handleActiveChange,
    handleRoleChange
  }
})

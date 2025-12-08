import admin from '@renderer/api/admin'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  const systemStats = ref<SystemStatus>()
  const userActionLogs = ref()
  const apiRuntimeLogs = ref()

  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)

  const getSystemStats = async (): Promise<void> => {
    try {
      const response = await admin.getSystemStats()
      systemStats.value = response.data.data
    } catch (error) {
      console.error('Failed to fetch system stats:', error)
    }
  }

  const getUserActionLogs = async (params = {}): Promise<void> => {
    try {
      const response = await admin.getUserActionLogs({
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        ...params
      })
      userActionLogs.value = response.data.logs
      total.value = response.data.pagination.total
    } catch (error) {
      console.error('Failed to fetch user action logs:', error)
    }
  }

  const getApiRuntimeLogs = async (params = {}): Promise<void> => {
    try {
      const response = await admin.getApiRuntimeLogs({
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        ...params
      })
      apiRuntimeLogs.value = response.data.logs
      total.value = response.data.pagination.total
    } catch (error) {
      console.error('Failed to fetch API runtime logs:', error)
    }
  }

  return {
    systemStats,
    currentPage,
    pageSize,
    total,
    userActionLogs,
    apiRuntimeLogs,
    getSystemStats,
    getUserActionLogs,
    getApiRuntimeLogs
  }
})

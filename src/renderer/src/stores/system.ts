import admin from '@renderer/api/admin'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  const systemStats = ref({})

  const getSystemStats = async (): Promise<void> => {
    try {
      const response = await admin.getSystemStats()
      systemStats.value = response.data.data
    } catch (error) {
      console.error('Failed to fetch system stats:', error)
    }
  }
  return {
    systemStats,
    getSystemStats
  }
})

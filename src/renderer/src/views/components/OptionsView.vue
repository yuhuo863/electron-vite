<template>
  <div>
    <h3 class="font-bold">高级选项</h3>
    <div class="flex flex-col space-y-3">
      <el-card shadow="never" class="mt3">
        <div class="flex flex-col space-y-2">
          <p>数据导出/导入</p>
          <p class="text-gray-400 text-xs">对密码存储的导出和导入。</p>
          <div class="flex flex-row space-x-2">
            <el-button type="primary" text icon="Download" @click="debounceExportData">
              导出数据
            </el-button>
            <el-upload
              ref="uploadRef"
              accept=".json,.csv"
              :show-file-list="true"
              :on-change="handleFileChange"
              :http-request="handleUploadRequest"
            >
              <template #trigger>
                <el-button type="primary" plain icon="Upload"> 导入数据 </el-button>
              </template>
            </el-upload>
          </div>
        </div>
      </el-card>
      <el-card shadow="never">
        <div class="flex flex-col space-y-2">
          <p>安全操作</p>
          <p class="text-gray-400 text-xs">
            临时锁定应用程序, 需要重新输入主密码才能继续访问应用。
          </p>
          <el-button type="danger" plain icon="Lock" class="w-30" @click="handleLockApp">
            锁定应用
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import user from '@renderer/api/user'
import { useAppStore } from '@renderer/stores/app'
import { useDebounceFn } from '@vueuse/core'
import { AxiosProgressEvent } from 'axios'
import {
  ElMessage,
  UploadFile,
  UploadInstance,
  UploadProgressEvent,
  UploadRequestOptions
} from 'element-plus'
import { useTemplateRef, ref } from 'vue'

/**
 * 将数据下载为文件
 * @param data 要下载的数据 Blob
 * @param fileName 文件名
 * @param mimeType MIME类型，如 'application/json'
 */
const downloadFile = (data: Blob, fileName: string, mimeType: string): void => {
  const url = URL.createObjectURL(new Blob([data], { type: mimeType }))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const handleExportData = async (): Promise<void> => {
  try {
    ElMessage.info('正在请求数据...')
    const response = await user.exportData({
      // 导出类型, 默认为JSON
      // format: 'csv'
    })

    const passwordList = response.data.passwords
    if (!passwordList || passwordList.length === 0) {
      ElMessage.warning('没有可导出的密码数据。')
      return
    }
    // --- 导出为 JSON 文件 ---
    const jsonFileName = `passwords_${Date.now()}.json`
    const jsonData = JSON.stringify(passwordList, null, 2)
    downloadFile(new Blob([jsonData]), jsonFileName, 'application/json')

    // --- 导出为 CSV 文件 ---
    // const csvFileName = `passwords_${Date.now()}.csv`
    // downloadFile(new Blob(['\ufeff' + response]), csvFileName, 'text/csv;charset=utf-8') // \ufeff 是 BOM，确保中文不乱码

    ElMessage.success('数据导出成功！')
  } catch (error) {
    ElMessage.error('数据导出失败！')
    console.error('Error exporting data:', error)
  }
}

const debounceExportData = useDebounceFn(handleExportData, 500)

const uploadEl = useTemplateRef<UploadInstance>('uploadRef')
const format = ref('')

const handleFileChange = (file: UploadFile): void => {
  if (!file) return
  const fileName = file.name.toLowerCase()
  if (fileName.endsWith('.json')) {
    format.value = 'json'
  } else if (fileName.endsWith('.csv')) {
    format.value = 'csv'
  } else {
    ElMessage.error('只支持导入 .json 或 .csv 文件')
    uploadEl.value?.clearFiles()
    return
  }

  if ((file.size as number) > 1024 * 1024) {
    ElMessage.error('文件大小不能超过 1MB')
    uploadEl.value?.clearFiles()
    return
  }
}

const handleUploadRequest = async (options: UploadRequestOptions): Promise<void> => {
  const { file, onProgress } = options
  const currentFormat = (format.value ??= file.name.endsWith('csv') ? 'csv' : 'json')
  let dataToSend: FormData | null = null

  try {
    if (currentFormat === 'csv') {
      dataToSend = new FormData()
      dataToSend.append('file', file)
    } else {
      dataToSend = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            // 解析 JSON 字符串为对象/数组
            resolve(JSON.parse(e.target?.result as string))
          } catch (error) {
            reject(new Error('JSON 文件内容解析失败。'))
            console.error('JSON 文件内容解析失败:', error)
          }
        }
        reader.onerror = reject
        reader.readAsText(file) // 读取文件内容
      })
    }
    const res = await user.importData(dataToSend, {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          onProgress({ percent } as UploadProgressEvent)
        }
      },
      params: {
        format: currentFormat
      }
    })
    ElMessage.success(res.message)
  } catch (error) {
    ElMessage.error('数据导入失败！')
    console.error('Error importing data:', error)
  }
}
const appStore = useAppStore()

const handleLockApp = (): void => {
  appStore.lockScreen()
}
</script>

<style scoped></style>

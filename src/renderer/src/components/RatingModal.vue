<script setup lang="ts">
import { ref } from 'vue'
import { VueDataUi, VueUiRatingDataset, VueUiSmileyConfig } from 'vue-data-ui'
import user from '@renderer/api/user'
import { ElMessage } from 'element-plus'
import { useFeedbackStatus } from '@renderer/hooks/useFeedbackStatus'
import { useAuthStore } from '@renderer/stores/auth'

const authStore = useAuthStore()

const smileyEl = ref(null)
const currentRating = ref<number>(0)
const disabled = ref(false)
const isRated = ref(false)

const dataset = ref<VueUiRatingDataset>({ rating: 0 })
const config = ref<VueUiSmileyConfig>({
  readonly: false,
  style: {
    fontFamily: 'inherit',
    itemSize: 32,
    backgroundColor: 'transparent',
    colors: {
      activeReadonly: ['#e20001', '#ff9f03', '#ffd004', '#61c900', '#059f00'],
      active: ['#e20001', '#ff9f03', '#ffd004', '#61c900', '#059f00'],
      inactive: ['#565656', '#565656', '#565656', '#565656', '#565656']
    },
    icons: { filled: false, useGradient: true },
    title: {
      textAlign: 'center',
      fontSize: 20,
      color: '#000000',
      bold: true,
      text: '系统评分',
      offsetY: 6,
      subtitle: {
        fontSize: 14,
        color: '#CCCCCC',
        bold: false,
        text: '请反馈您的使用体验，感谢您的支持！',
        offsetY: 12
      }
    },
    rating: {
      show: false,
      fontSize: 28,
      bold: true,
      roundingValue: 1,
      position: 'bottom',
      offsetY: 0,
      offsetX: 0
    },
    tooltip: {
      show: true,
      fontSize: 14,
      offsetY: 0,
      color: '#CCCCCC',
      bold: true,
      backgroundColor: '#1A1A1A',
      borderColor: '#e1e5e8',
      borderRadius: 4,
      boxShadow: '0 6px 12px -6px rgba(0,0,0,0.2)'
    }
  }
})

const FRONTEND_COOLDOWN_DAYS = 7 // 前端缓存冷却期 (天)
const { updateLocalStorage } = useFeedbackStatus(authStore.userInfo?.id as string)
const handleSumitRating = async (): Promise<void> => {
  currentRating.value = await smileyEl.value?.getData()
  if (currentRating.value === 0) return
  try {
    const response = await user.submitRating(currentRating.value)
    ElMessage.success(response.message)
    updateLocalStorage(FRONTEND_COOLDOWN_DAYS)
    isRated.value = true // 标记为已评分
  } catch (error) {
    console.error(error)
  } finally {
    disabled.value = true
  }
}

defineProps({
  dialogVisible: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['update:dialogVisible'])
const handleClose = (): void => {
  emit('update:dialogVisible', false)
  if (!isRated.value) {
    // 如果用户手动关闭且没有进行评分，设置一个短期缓存(1天)，避免立即再次弹出
    updateLocalStorage(1)
  }
}
</script>

<template>
  <el-dialog
    :model-value="dialogVisible"
    :modal="false"
    modal-penetrable
    top="20vh"
    @close="handleClose"
  >
    <div class="">
      <VueDataUi ref="smileyEl" component="VueUiSmiley" :dataset="dataset" :config="config" />
      <div v-if="smileyEl" class="flex justify-center mt3">
        <el-button type="primary" plain :disabled="disabled" @click="handleSumitRating"
          >提交</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>

<style lang="css" scoped></style>

<script setup lang="ts">
import { ref } from 'vue'
import { VueDataUi, VueUiRatingDataset, VueUiSmileyConfig } from 'vue-data-ui'

const smileyEl = ref(null)
const currentRating = ref(null)
const disabled = ref(false)
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

const handleSumitRating = async (): Promise<void> => {
  currentRating.value = await smileyEl.value?.getData()
  if (currentRating.value === 0) return
  try {
    // do something
    console.log('currentRating.value=>', currentRating.value)
  } catch (error) {
    console.error(error)
  } finally {
    disabled.value = true
  }
}
const dialogVisible = ref(false)
</script>

<template>
  <el-dialog v-model="dialogVisible" :modal="false" modal-penetrable top="20vh">
    <div class="">
      <VueDataUi ref="smileyEl" component="VueUiSmiley" :dataset="dataset" :config="config" />
      <div v-if="smileyEl" class="flex justify-center mt3">
        <el-button type="primary" plain :disabled="disabled" @click="handleSumitRating">{{
          disabled ? '谢谢!' : '提交'
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="css" scoped></style>

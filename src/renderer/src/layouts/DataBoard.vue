<template>
  <div class="flex flex-col ispace-y-5">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="font-bold">数据面板</h2>
      </div>

      <div>
        <!-- =-= -->
      </div>
    </div>
    <el-divider content-position="left">分析您当前账户的数据存储</el-divider>

    <div class="content">
      <el-row :gutter="20" class="data-row">
        <el-col :xs="24" :sm="24" :md="12" class="data-col">
          <el-card shadow="never" header="密码存储统计">
            <div class="chart-placeholder pie-placeholder">
              <VueDataUi
                v-if="dataset2.length > 1"
                component="VueUiDonut"
                :dataset="dataset2"
                :config="config2"
              />
              <el-empty v-else description="暂无更多分类">
                <el-button type="primary" size="small" @click="handleAddCategory"
                  >添加分类</el-button
                >
              </el-empty>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" class="data-col">
          <el-card shadow="never" header="最近活动记录(10)">
            <el-table :data="userPasswordLogs" max-height="480">
              <el-table-column prop="action" label="操作" align="center" />
              <el-table-column prop="title" label="项目" width="120" align="center" />
              <el-table-column prop="timestamp" label="时间" width="100" align="center">
                <template #default="{ row }">
                  {{ formatActionTime(row.timestamp) }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import user from '@renderer/api/user'
import { useCategoryStore } from '@renderer/stores/category'
import { computed, onMounted, ref, watch } from 'vue'
import { VueDataUi, VueUiDonutConfig, VueUiDonutDatasetItem } from 'vue-data-ui'
import 'vue-data-ui/style.css'
import { useRouter } from 'vue-router'
import { formatActionTime } from '@renderer/utils/time'
import { useDark } from '@vueuse/core'

const dataset2 = ref<VueUiDonutDatasetItem[]>([])

const config2 = ref<VueUiDonutConfig>({
  debug: false,
  loading: false,
  pie: false,
  autoSize: true,
  type: 'classic',
  responsive: false,
  useBlurOnHover: true,
  useCssAnimation: true,
  events: { datapointEnter: null, datapointLeave: null, datapointClick: null },
  serieToggleAnimation: { show: true, durationMs: 500 },
  startAnimation: { show: true, durationMs: 1000, staggerMs: 50 },
  style: {
    fontFamily: 'inherit',
    chart: {
      useGradient: true,
      gradientIntensity: 40,
      width: 512,
      height: 360,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      layout: {
        curvedMarkers: true,
        labels: {
          dataLabels: {
            show: true,
            useLabelSlots: false,
            hideUnderValue: 3,
            prefix: '',
            suffix: ''
          },
          value: { rounding: 0, show: true },
          percentage: { bold: true, fontSize: 18, rounding: 0, minFontSize: 6 },
          name: { bold: false, fontSize: 14, minFontSize: 6 },
          hollow: {
            show: true,
            total: {
              show: false,
              bold: false,
              fontSize: 18,
              color: '#CCCCCC',
              text: 'Total',
              offsetY: -16,
              value: {
                color: '#CCCCCC',
                fontSize: 18,
                bold: true,
                suffix: '',
                prefix: '',
                offsetY: -12,
                rounding: 0
              }
            },
            average: {
              show: false,
              bold: false,
              fontSize: 18,
              color: '#CCCCCC',
              text: 'Average',
              offsetY: 0,
              value: {
                color: '#CCCCCC',
                fontSize: 18,
                bold: true,
                suffix: '',
                prefix: '',
                offsetY: 6,
                rounding: 0
              }
            }
          }
        },
        donut: {
          radiusRatio: 0.3,
          strokeWidth: 64,
          borderWidth: 2,
          useShadow: false,
          shadowColor: '#1A1A1A',
          emptyFill: '#2A2A2A',
          selectedColor: '#0000001A',
          borderColorAuto: true,
          borderColor: '#3A3A3A'
        }
      },
      comments: { show: true, showInTooltip: true, width: 100, offsetX: 0, offsetY: 0 },
      legend: {
        backgroundColor: 'transparent',
        show: true,
        fontSize: 16,
        bold: false,
        roundingValue: 0,
        roundingPercentage: 0,
        showValue: true,
        showPercentage: true,
        position: 'bottom'
      },
      title: {
        text: '按分类存储',
        fontSize: 20,
        bold: true,
        textAlign: 'center',
        paddingLeft: 0,
        paddingRight: 0,
        subtitle: { color: '#CCCCCC', text: '', fontSize: 16, bold: false }
      },
      tooltip: {
        show: true,
        backgroundColor: '#1A1A1A',
        fontSize: 14,
        showValue: true,
        showPercentage: true,
        roundingValue: 0,
        roundingPercentage: 0,
        customFormat: null,
        borderRadius: 4,
        borderColor: '#3A3A3A',
        borderWidth: 1,
        backgroundOpacity: 30,
        position: 'center',
        offsetY: 24,
        smooth: true,
        smoothForce: 0.18,
        smoothSnapThreshold: 0.25
      }
    }
  },
  userOptions: {
    show: true,
    showOnChartHover: false,
    keepStateOnChartLeave: true,
    position: 'right',
    buttons: {
      tooltip: true,
      pdf: true,
      img: true,
      csv: true,
      table: true,
      labels: true,
      fullscreen: true,
      annotator: true
    },
    buttonTitles: {
      open: 'Open options',
      close: 'Close options',
      tooltip: 'Toggle tooltip',
      pdf: 'Download PDF',
      csv: 'Download CSV',
      img: 'Download PNG',
      table: 'Toggle table',
      labels: 'Toggle labels',
      fullscreen: 'Toggle fullscreen',
      annotator: 'Toggle annotator'
    },
    print: { scale: 2, orientation: 'auto', overflowTolerance: 0.2 }
  },
  table: {
    show: false,
    useDialog: false,
    responsiveBreakpoint: 300,
    columnNames: { series: 'Series', value: 'Value', percentage: 'Percentage' },
    th: { backgroundColor: '#2A2A2A', color: '#CCCCCC', outline: 'none' },
    td: {
      backgroundColor: '#2A2A2A',
      color: '#CCCCCC',
      outline: 'none',
      roundingValue: 0,
      roundingPercentage: 0
    }
  }
})

const isDark = useDark()
watch(
  isDark,
  (newValue) => {
    if (newValue) {
      config2.value.theme = 'celebrationNight'
    } else {
      config2.value.theme = 'concrete'
    }
  },
  { immediate: true }
)

const categoryStore = useCategoryStore()

const userPasswordLogs = ref([])
const passwordActionMap = computed(() => ({
  password_created: '新增',
  password_accessed: '访问',
  password_updated: '修改',
  password_deleted: '删除'
}))
onMounted(async () => {
  await categoryStore.fetchCategories()
  dataset2.value = categoryStore.categoryList.map((category) => ({
    name: category.name,
    values: [category.passwordCount]
  }))
  const response = await user.getPasswordLogs()
  userPasswordLogs.value = response.data.logs.map((log) => ({
    action: passwordActionMap.value[log.action],
    title: log.password.title,
    timestamp: log.timestamp
  }))
})

const router = useRouter()
const handleAddCategory = (): void => {
  router.push('/category')
}
</script>

<style scoped>
:deep(.el-divider__text.is-left) {
  font-size: 0.8rem;
  font-weight: normal;
  color: rgba(162, 167, 175, 0.8);
}

/* 行间距 */
.data-row {
  margin-bottom: 20px;
}

/* 占位符样式，确保卡片有内容高度 */
.chart-placeholder {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
}
</style>

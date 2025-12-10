<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import DynamicBreadcrumb from './components/DynamicBreadcrumb.vue'
import {
  VueDataUi,
  VueUiSparkStackbarConfig,
  VueUiQuickChartConfig,
  VueUiMoodRadarDataset,
  VueUiMoodRadarConfig,
  VueUiQuickChartDataset,
  VueUiSparkStackbarDatasetItem
} from 'vue-data-ui'
import 'vue-data-ui/style.css'
import { useSystemStore } from '@renderer/stores/system'
import { useDark } from '@vueuse/core'

const systemStore = useSystemStore()

const dataset1 = ref<VueUiSparkStackbarDatasetItem[]>([])
const dataset2 = ref<VueUiQuickChartDataset>([])
const dataset3 = ref<VueUiMoodRadarDataset>({
  '1': 96,
  '2': 64,
  '3': 128,
  '4': 256,
  '5': 384
})

const config1 = ref<VueUiSparkStackbarConfig>({
  debug: false,
  loading: false,
  style: {
    fontFamily: 'inherit',
    animation: { show: true, animationFrames: 60 },
    bar: { gradient: { show: true, intensity: 40, underlayerColor: '#FFFFFF' } },
    legend: {
      margin: '6px 0 0 0',
      textAlign: 'left',
      show: true,
      fontSize: 12
    },
    title: {
      textAlign: 'left',
      text: '用户角色统计',
      fontSize: 16,
      bold: true,
      margin: '0 0 6px 0',
      subtitle: { color: '#A1A1A1', text: '', fontSize: 12, bold: false }
    },
    tooltip: {
      show: true
    }
  }
})

const config2 = ref<VueUiQuickChartConfig>({
  debug: false,
  loading: false,
  responsive: false,
  barAnimated: true,
  barGap: 12,
  barStrokeWidth: 1,
  blurOnHover: true,
  chartIsBarUnderDatasetLength: 6,
  dataLabelFontSize: 14,
  dataLabelRoundingPercentage: 1,
  dataLabelRoundingValue: 1,
  donutCurvedMarkers: true,
  donutHideLabelUnderPercentage: 3,
  donutLabelMarkerStrokeWidth: 1,
  donutRadiusRatio: 0.4,
  donutShowTotal: true,
  donutStrokeWidth: 2,
  donutStroke: '#2A2A2A',
  donutThicknessRatio: 0.18,
  donutTotalLabelFontSize: 24,
  donutTotalLabelOffsetY: 0,
  donutTotalLabelText: 'Total',
  donutUseShadow: false,
  donutShadowColor: '#1A1A1A',
  fontFamily: 'inherit',
  height: 338,
  legendFontSize: 0,
  legendIcon: 'circleFill',
  legendIconSize: 0,
  legendPosition: 'bottom',
  lineAnimated: true,
  lineSmooth: true,
  lineStrokeWidth: 2,
  paletteStartIndex: 0,
  showDataLabels: true,
  showLegend: true,
  showTooltip: true,
  showUserOptions: true,
  userOptionsButtons: {
    tooltip: true,
    pdf: true,
    img: true,
    fullscreen: true,
    annotator: true
  },
  userOptionsButtonTitles: {
    open: 'Open options',
    close: 'Close options',
    tooltip: 'Toggle tooltip',
    pdf: 'Download PDF',
    img: 'Download PNG',
    fullscreen: 'Toggle fullscreen',
    annotator: 'Toggle annotator'
  },
  userOptionsPrint: {
    scale: 2,
    overflowTolerance: 0.2,
    orientation: 'auto'
  },
  title: '最近7天活跃用户',
  titleBold: true,
  titleFontSize: 16,
  titleTextAlign: 'center',
  tooltipCustomFormat: null,
  tooltipBorderRadius: 4,
  tooltipBorderColor: '#3A3A3A',
  tooltipBorderWidth: 1,
  tooltipFontSize: 14,
  tooltipBackgroundOpacity: 30,
  tooltipPosition: 'center',
  tooltipOffsetY: 24,
  tooltipSmooth: true,
  tooltipSmoothForce: 0.18,
  tooltipSmoothSnapThreshold: 0.25,
  useCustomLegend: false,
  valuePrefix: '',
  valueSuffix: '',
  width: 512,
  xyAxisStroke: '#4A4A4A',
  xyAxisStrokeWidth: 1,
  xyGridStroke: '#5A5A5A',
  xyGridStrokeWidth: 0.5,
  xyHighlighterColor: '#FFFFFF',
  xyHighlighterOpacity: 0.05,
  xyLabelsXFontSize: 8,
  xyLabelsYFontSize: 12,
  xyPaddingBottom: 24,
  xyPaddingLeft: 24,
  xyPaddingRight: 12,
  xyPaddingTop: 24,
  xyPeriods: [],
  // datetimeFormatter: {
  //   enable: true,
  //   locale: 'en',
  //   useUTC: false,
  //   januaryAsYear: false,
  //   options: {
  //     year: 'yyyy',
  //     month: "MMM 'yy",
  //     day: 'dd MMM',
  //     hour: 'HH:mm',
  //     minute: 'HH:mm:ss',
  //     second: 'HH:mm:ss'
  //   }
  // },
  xyPeriodLabelsRotation: 0,
  xyPeriodLabelsAutoRotate: {
    enable: true,
    angle: -30
  },
  xyPeriodsShowOnlyAtModulo: true,
  xyPeriodsModulo: 12,
  xyScaleSegments: 10,
  xyShowAxis: true,
  xyShowGrid: true,
  xyShowScale: true,
  yAxisLabel: 'Count',
  xAxisLabel: 'Date',
  axisLabelsFontSize: 12,
  zoomXy: true,
  zoomColor: '#CCCCCC',
  zoomHighlightColor: '#4A4A4A',
  zoomFontSize: 14,
  zoomUseResetSlot: false,
  userOptionsPosition: 'right',
  zoomMinimap: {
    show: true,
    smooth: true,
    selectedColor: '#8A8A8A',
    selectedColorOpacity: 0.2,
    lineColor: '#1f77b4',
    selectionRadius: 2,
    indicatorColor: '#CCCCCC',
    verticalHandles: false,
    compact: true,
    merged: false,
    frameColor: '#6A6A6A'
  },
  zoomStartIndex: null,
  zoomEndIndex: null,
  showUserOptionsOnChartHover: false,
  keepUserOptionsStateOnChartLeave: true,
  zoomEnableRangeHandles: true,
  zoomEnableSelectionDrag: true,
  zoomFocusOnDrag: false,
  zoomFocusRangeRatio: 0.2
})

const config3 = ref<VueUiMoodRadarConfig>({
  debug: false,
  loading: false,
  responsive: false,
  style: {
    fontFamily: 'inherit',
    chart: {
      layout: {
        grid: { show: true, strokeWidth: 0.5 },
        outerPolygon: { strokeWidth: 1 },
        dataPolygon: {
          opacity: 60,
          gradient: { show: true, intensity: 5 },
          stroke: '#5f8bee',
          strokeWidth: 0
        },
        smileys: {
          strokeWidth: 1,
          colors: { '1': '#e20001', '2': '#ff9f03', '3': '#ffd004', '4': '#9ac900', '5': '#059f00' }
        },
        dataLabel: {
          roundingPercentage: 0,
          roundingValue: 0,
          bold: true,
          prefix: '',
          suffix: ''
        }
      },
      title: {
        text: '用户系统评分(测试数据)',
        fontSize: 20,
        bold: true,
        textAlign: 'center',
        paddingLeft: 0,
        paddingRight: 0,
        subtitle: { color: '#A1A1A1', text: '', fontSize: 16, bold: false }
      },
      legend: {
        bold: false,
        show: true,
        fontSize: 16,
        roundingPercentage: 0,
        roundingValue: 0,
        position: 'top'
      }
    }
  },
  table: {
    show: true,
    useDialog: true,
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
  },
  userOptions: {
    show: true,
    showOnChartHover: false,
    keepStateOnChartLeave: true,
    position: 'right',
    buttons: { pdf: true, img: true, csv: true, table: true, fullscreen: true, annotator: true },
    buttonTitles: {
      open: 'Open options',
      close: 'Close options',
      pdf: 'Download PDF',
      csv: 'Download CSV',
      img: 'Download PNG',
      table: 'Toggle table',
      fullscreen: 'Toggle fullscreen',
      annotator: 'Toggle annotator'
    },
    print: { scale: 2, orientation: 'auto', overflowTolerance: 0.2 }
  }
})

onMounted(async () => {
  await systemStore.getSystemStats()
  dataset1.value = systemStore.systemStats?.users ?? []
  dataset2.value = systemStore.systemStats?.dailyActiveUsers.map((item) => item.count) ?? []
  config2.value.xyPeriods = systemStore.systemStats?.dailyActiveUsers.map((item) => item.date) ?? []
})

const isDark = useDark()
watch(
  isDark,
  (newValue) => {
    if (newValue) {
      config1.value.theme = 'celebrationNight'
      config2.value.theme = 'celebrationNight'
      config3.value.theme = 'celebrationNight'
    } else {
      config1.value.theme = 'concrete'
      config2.value.theme = 'concrete'
      config3.value.theme = 'concrete'
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div>
    <DynamicBreadcrumb />
    <div class="flex flex-col gap-5 m5">
      <div>
        <VueDataUi component="VueUiSparkStackbar" :dataset="dataset1" :config="config1" />
      </div>
      <div>
        <VueDataUi component="VueUiQuickChart" :dataset="dataset2" :config="config2" />
      </div>
      <div class="p10">
        <VueDataUi component="VueUiMoodRadar" :dataset="dataset3" :config="config3" />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>

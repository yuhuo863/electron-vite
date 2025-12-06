<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DynamicBreadcrumb from './components/DynamicBreadcrumb.vue'
import { VueUiSparkStackbar, VueUiQuickChart } from 'vue-data-ui'
import 'vue-data-ui/style.css'
import { useSystemStore } from '@renderer/stores/system'

const systemStore = useSystemStore()

// const presetColors = ['#f56a00', '#722ed1', '#13c2c2', '#1890ff', '#fadb14'];

const dataset1 = ref([])
const dataset2 = ref([])

onMounted(async () => {
  await systemStore.getSystemStats()
  dataset1.value = systemStore.systemStats.users
  dataset2.value = systemStore.systemStats.passwords
})

const config1 = {
  debug: false,
  loading: false,
  style: {
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    animation: { show: true, animationFrames: 60 },
    bar: { gradient: { show: true, intensity: 40, underlayerColor: '#FFFFFF' } },
    legend: {
      margin: '6px 0 0 0',
      textAlign: 'left',
      show: true,
      fontSize: 12,
      name: { color: '#000000', bold: false },
      value: { show: true, bold: false, color: '#000000', prefix: '', suffix: '', rounding: 0 },
      percentage: { show: true, bold: false, color: '#000000', rounding: 1 }
    },
    title: {
      textAlign: 'left',
      text: '用户角色统计',
      color: '#000',
      fontSize: 16,
      bold: true,
      margin: '0 0 6px 0'
      // subtitle: { color: '#000', text: 'Subtitle', fontSize: 12, bold: false }
    },
    tooltip: {
      show: true,
      color: '#CCCCCC',
      backgroundColor: '#1A1A1A',
      fontSize: 14,
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
}

const config2 = {
  debug: false,
  loading: false,
  responsive: false,
  backgroundColor: 'transparent',
  barAnimated: true,
  barGap: 12,
  barStrokeWidth: 1,
  blurOnHover: true,
  chartIsBarUnderDatasetLength: 6,
  color: '#000000',
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
  legendFontSize: 12,
  legendIcon: 'circleFill',
  legendIconSize: 12,
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
  title: '密码强度统计',
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
  xyPeriods: [
    1767196800000, 1769875200000, 1772294400000, 1774972800000, 1777564800000, 1780243200000,
    1782835200000, 1785513600000, 1788192000000, 1790784000000, 1793462400000, 1796054400000,
    1798732800000, 1801411200000, 1803830400000, 1806508800000, 1809100800000, 1811779200000,
    1814371200000, 1817049600000, 1819728000000
  ],
  datetimeFormatter: {
    enable: true,
    locale: 'en',
    useUTC: false,
    januaryAsYear: false,
    options: {
      year: 'yyyy',
      month: "MMM 'yy",
      day: 'dd MMM',
      hour: 'HH:mm',
      minute: 'HH:mm:ss',
      second: 'HH:mm:ss'
    }
  },
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
  yAxisLabel: 'Quantity',
  xAxisLabel: 'Time',
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
}
</script>

<template>
  <div>
    <DynamicBreadcrumb />
    <div class="m5 flex gap-6 flex-col">
      <div style="width: 750px" class="h-30 rounded p5 bg-indigo-100/80 shadow-md">
        <VueUiSparkStackbar :dataset="dataset1" :config="config1" />
      </div>
      <div class="flex">
        <div style="width: 375px" class="bg-indigo-100/80">
          <VueUiQuickChart :dataset="dataset2" :config="config2" />
        </div>
        <div>2</div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>

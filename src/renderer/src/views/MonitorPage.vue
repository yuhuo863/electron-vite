<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DynamicBreadcrumb from './components/DynamicBreadcrumb.vue'
import {
  VueDataUi,
  VueUiSparkStackbarConfig,
  VueUiQuickChartConfig,
  VueUiMoodRadarDataset,
  VueUiMoodRadarConfig,
  VueUiGaugeConfig,
  VueUiGaugeDataset,
  VueUiQuickChartDataset,
  VueUiSparkStackbarDatasetItem
} from 'vue-data-ui'
import 'vue-data-ui/style.css'
import { useSystemStore } from '@renderer/stores/system'

const systemStore = useSystemStore()

const dataset1 = ref<VueUiSparkStackbarDatasetItem[]>([])
const dataset2 = ref<VueUiQuickChartDataset>([])
const dataset3 = ref<VueUiQuickChartDataset>([])
const dataset4 = ref<VueUiMoodRadarDataset>({
  '1': 96,
  '2': 64,
  '3': 128,
  '4': 256,
  '5': 384
})
const dataset5 = ref<VueUiGaugeDataset>({
  base: 1,
  value: 0.1,
  series: [
    {
      from: 0.1,
      to: 0.4,
      color: '#ff6400',
      name: 'bad'
    },
    {
      from: 0.4,
      to: 0.7,
      color: '#5f8bee',
      name: 'acceptable'
    },
    {
      from: 0.7,
      to: 1,
      color: '#42d392',
      name: 'fascinating'
    }
  ]
})

const config1 = ref<VueUiSparkStackbarConfig>({
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
})

const config2 = ref<VueUiQuickChartConfig>({
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
})

const config3 = ref<VueUiQuickChartConfig>({
  debug: false,
  loading: false,
  responsive: false,
  theme: '',
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

const config4 = ref<VueUiMoodRadarConfig>({
  debug: false,
  loading: false,
  responsive: false,
  style: {
    fontFamily: 'inherit',
    chart: {
      backgroundColor: 'transparent',
      color: '#000000',
      layout: {
        grid: { show: true, stroke: '#5A5A5A', strokeWidth: 0.5 },
        outerPolygon: { stroke: '#ffffff', strokeWidth: 1 },
        dataPolygon: {
          color: '#5f8bee',
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
          color: '#000000',
          roundingPercentage: 0,
          roundingValue: 0,
          bold: true,
          prefix: '',
          suffix: ''
        }
      },
      title: {
        text: '用户系统评分',
        color: '#000000',
        fontSize: 20,
        bold: true,
        textAlign: 'center',
        paddingLeft: 0,
        paddingRight: 0,
        subtitle: { color: '#A1A1A1', text: '', fontSize: 16, bold: false }
      },
      legend: {
        color: '#000000',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        bold: false,
        show: true,
        fontSize: 16,
        roundingPercentage: 0,
        roundingValue: 0,
        position: 'bottom'
      }
    }
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

const config5 = ref<VueUiGaugeConfig>({
  debug: false,
  loading: false,
  responsive: false,
  style: {
    fontFamily: 'inherit',
    chart: {
      backgroundColor: 'transparent',
      color: '#000000',
      animation: { use: true, speed: 1, acceleration: 1 },
      layout: {
        radiusRatio: 1,
        track: { size: 1, useGradient: true, gradientIntensity: 20 },
        markers: {
          show: true,
          prefix: '',
          suffix: '',
          color: '#CCCCCC',
          bold: true,
          fontSizeRatio: 1,
          offsetY: 0,
          roundingValue: 0
        },
        segmentSeparators: {
          show: false,
          offsetOut: 0,
          offsetIn: 0,
          stroke: '#4A4A4A',
          strokeWidth: 2
        },
        segmentNames: {
          show: true,
          curved: true,
          offsetRatio: 1.1,
          fontSize: 16,
          minFontSize: 6,
          useSerieColor: true,
          color: '#CCCCCC',
          bold: false
        },
        indicatorArc: { show: true, radius: 123, fill: '#CCCCCC' },
        pointer: {
          show: true,
          type: 'pointy',
          size: 1,
          stroke: '#4A4A4A',
          strokeWidth: 12,
          useRatingColor: true,
          color: '#1A1A1A',
          circle: { radius: 10, stroke: '#3A3A3A', strokeWidth: 2, color: '#5A5A5A' }
        }
      },
      legend: {
        show: true,
        fontSize: 48,
        prefix: '',
        suffix: '',
        roundingValue: 1,
        showPlusSymbol: true,
        useRatingColor: true,
        color: '#CCCCCC'
      },
      title: {
        text: '用户账号激活率',
        color: '#000000',
        fontSize: 20,
        bold: true,
        textAlign: 'center',
        paddingLeft: 0,
        paddingRight: 0,
        subtitle: { color: '#A1A1A1', text: '', fontSize: 16, bold: false }
      }
    }
  },
  userOptions: {
    show: true,
    showOnChartHover: false,
    keepStateOnChartLeave: true,
    position: 'right',
    buttons: { pdf: true, img: true, fullscreen: true, annotator: true },
    buttonTitles: {
      open: 'Open options',
      close: 'Close options',
      pdf: 'Download PDF',
      img: 'Download PNG',
      fullscreen: 'Toggle fullscreen',
      annotator: 'Toggle annotator'
    },
    print: { scale: 2, orientation: 'auto', overflowTolerance: 0.2 }
  },
  translations: { base: 'Base' }
})

onMounted(async () => {
  await systemStore.getSystemStats()
  dataset1.value = systemStore.systemStats?.users ?? []
  dataset2.value = (systemStore.systemStats?.passwords as VueUiQuickChartDataset) ?? []
  dataset3.value = systemStore.systemStats?.dailyActiveUsers.map((item) => item.count) ?? []
  config3.value.xyPeriods = systemStore.systemStats?.dailyActiveUsers.map((item) => item.date) ?? []
  dataset5.value.value = systemStore.systemStats?.activeRate ?? 0
})
</script>

<template>
  <div>
    <DynamicBreadcrumb />
    <div class="m5 flex gap-5 flex-col">
      <div style="width: 750px" class="h-30 rounded p5 bg-indigo-100/80 shadow-md">
        <VueDataUi component="VueUiSparkStackbar" :dataset="dataset1" :config="config1" />
      </div>
      <div class="flex space-x-5">
        <div style="width: 375px" class="pt5 bg-indigo-100/80 rounded shadow-md">
          <VueDataUi component="VueUiQuickChart" :dataset="dataset2" :config="config2" />
        </div>
        <div style="width: 375px" class="pt5 bg-indigo-100/80 rounded shadow-md">
          <VueDataUi component="VueUiQuickChart" :dataset="dataset3" :config="config3" />
        </div>
      </div>
      <div>
        <div class="flex space-x-5">
          <div style="width: 375px" class="pt5 bg-indigo-100/80 rounded shadow-md">
            <VueDataUi component="VueUiMoodRadar" :dataset="dataset4" :config="config4" />
          </div>
          <div style="width: 375px" class="pt5 bg-indigo-100/80 rounded shadow-md">
            <VueDataUi component="VueUiGauge" :dataset="dataset5" :config="config5" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>

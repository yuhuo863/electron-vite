import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'
import { presetWind3 } from '@unocss/preset-wind3'

export default defineConfig({
  // 1. 预设 (Presets)
  presets: [
    // 默认预设：兼容 Tailwind CSS / Windi CSS 的工具类
    // @ts-ignore ignore-typecheck
    presetWind3(),

    // 属性化模式：允许使用 <div text="red" p="4"> 写法
    presetAttributify(),

    // 图标预设：允许使用 class="i-carbon-sun" 自动引入图标
    // 需要安装图标集，例如: npm i -D @iconify-json/ep (Element Plus 图标)
    presetIcons({
      scale: 1.2, // 默认图标大小缩放
      warn: true
    }),

    // 排版预设：提供一组 prose 类，用于美化 Markdown 或 HTML 内容
    presetTypography()
  ],

  // 2. 转换器 (Transformers)
  transformers: [
    // 指令转换器：支持在 CSS/SCSS 中使用 @apply, @screen, theme()
    transformerDirectives(),

    // 变体组转换器：支持 hover:(bg-gray-400 text-white) 写法
    transformerVariantGroup()
  ],

  // 3. 自定义快捷方式 (Shortcuts) - 类似于混合宏
  shortcuts: {
    // 例子：定义一个通用 flex 居中类
    'flex-center': 'flex justify-center items-center',
    'flex-col-center': 'flex flex-col justify-center items-center',

    // 例子：定义通用按钮样式
    'btn-primary':
      'py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300'
  },

  // 4. 自定义规则 (Rules) - 如果需要极其特殊的 CSS
  rules: [
    // [正则, 处理函数]
    // 例子：使用 m-1 会生成 margin: 0.25rem
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${Number(d) / 4}rem` })]
  ],

  // 5. 主题配置 (Theme) - 扩展颜色、断点等
  theme: {
    colors: {
      primary: '#409EFF' // 可以配合 class="text-primary" 使用
    }
  },

  // UnoCSS 扫描配置的根对象
  content: {
    // 内容管道（Content Pipeline）来处理要扫描的文件
    pipeline: {
      // 包含文件路径模式（glob patterns 或正则表达式）的数组
      // UnoCSS 应该处理的文件集合
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        'src/renderer/src/**.{js,ts}'
      ]
    }
  }
})

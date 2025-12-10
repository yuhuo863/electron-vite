// 声明 zh-cn.mjs 模块
declare module 'element-plus/dist/locale/zh-cn.mjs' {
  // 语言包导出一个包含 default 属性的对象，该对象遵循 Locale 接口
  // 声明它导出了一个默认对象
  import type { Language } from 'element-plus/es/locale'
  // 如果无法导入 Language 类型，可以简单声明为 any 或对象：
  // const lang: any;
  // export default lang;

  const lang: Language
  export default lang
}

// 建议也声明另一个可能的路径，以防将来Element Plus版本变更
declare module 'element-plus/locale/lang/zh-cn' {
  import type { Language } from 'element-plus/es/locale'
  const lang: Language
  export default lang
}

import localforage from 'localforage'

// 初始化 localforage 实例
const lf = localforage.createInstance({
  name: 'Secret Storage', // 数据库名称
  storeName: 'secret', // 表/对象存储空间的名称
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE] // 优先使用 IndexedDB
})

/**
 * 封装的存储服务对象
 * 提供类似 localStorage 的 set/get/remove/clear 方法
 */
const storage = {
  /**
   * 设置数据
   * @param {string} key 键名
   * @param {*} value 键值 (可以是任何类型，包括对象、数组等)
   * @returns {Promise<*>} 存储的值
   */
  async set(key: string, value: any): Promise<any> {
    try {
      // localforage 自动处理序列化
      const result = await lf.setItem(key, value)
      return result
    } catch (error) {
      console.error(`LocalForage setItem error for key: ${key}`, error)
      return null
    }
  },

  /**
   * 获取数据
   * @param {string} key 键名
   * @returns {Promise<*>} 键值 (如果不存在则返回 null)
   */
  async get(key: string): Promise<any> {
    try {
      // localforage 自动处理反序列化
      const value = await lf.getItem(key)
      // 保持与 localStorage.getItem() 不存在时返回 null 的习惯
      return value === undefined ? null : value
    } catch (error) {
      console.error(`LocalForage getItem error for key: ${key}`, error)
      return null
    }
  },

  /**
   * 移除单个键值对
   * @param {string} key 键名
   * @returns {Promise<void>}
   */
  async remove(key: string): Promise<void> {
    try {
      await lf.removeItem(key)
    } catch (error) {
      console.error(`LocalForage removeItem error for key: ${key}`, error)
    }
  },

  /**
   * 清空所有存储数据 (注意: 会清空当前实例下的所有数据)
   * @returns {Promise<void>}
   */
  async clear(): Promise<void> {
    try {
      await lf.clear()
    } catch (error) {
      console.error('LocalForage clear error', error)
    }
  },

  /**
   * 获取所有键名
   * @returns {Promise<string[]>} 键名数组
   */
  async keys(): Promise<string[]> {
    try {
      return await lf.keys()
    } catch (error) {
      console.error('LocalForage keys error', error)
      return []
    }
  },

  // 允许直接访问底层的 localforage 实例，以备高级用法
  get instance() {
    return lf
  }
}

export default storage

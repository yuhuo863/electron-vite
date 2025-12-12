<template>
  <div class="page-404-container">
    <div class="error-content">
      <div class="error-code">404</div>
      <div class="error-message">
        <h2>页面未找到</h2>
        <p>Page not found</p>
      </div>
      <div class="error-actions">
        <el-button type="primary" size="large" @click="goHome"> 返回首页 </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = (): void => {
  router.push('/')
}
</script>

<style scoped>
/* 全局容器 */
.page-404-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
}

/* 核心内容区 */
.error-content {
  text-align: center;
  max-width: 500px;
  width: 100%;
}

/* 404数字样式 */
.error-code {
  font-size: 100px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 20px;
}

/* 提示文案 */
.error-message {
  margin-bottom: 32px;
}

.error-message h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.error-message p {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
}

/* 响应式适配 */
@media (max-width: 576px) {
  .error-code {
    font-size: 80px;
  }

  .error-message h2 {
    font-size: 20px;
  }

  .error-message p {
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;
    gap: 12px;
  }

  .error-actions .el-button {
    width: 100%;
  }
}
</style>

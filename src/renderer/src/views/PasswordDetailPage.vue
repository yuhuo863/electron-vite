<script setup lang="ts">
import { useRoute } from 'vue-router'
import DynamicBreadcrumb from './components/DynamicBreadcrumb.vue'
import { onMounted, ref } from 'vue'
import password from '@renderer/api/password'
import { ElMessage } from 'element-plus'

const route = useRoute()

const currentPassword = ref<PasswordDetail>()
const passwordHistory = ref<PasswordHistory[] | null>(null)

onMounted(async () => {
  try {
    const responseCollection = await Promise.allSettled([
      password.getPasswordDetail(route.params.id as string),
      password.getPasswordHistory(route.params.id as string)
    ])

    currentPassword.value =
      responseCollection[0].status === 'fulfilled'
        ? {
            ...responseCollection[0].value.data,
            showPassword: false
          }
        : null
    const historyData =
      responseCollection[1].status === 'fulfilled' ? responseCollection[1].value.data.history : null
    passwordHistory.value = historyData && Array.isArray(historyData) ? historyData : null
  } catch (error) {
    ElMessage.error('获取详情失败')
    console.error(error)
  }
})

const isReverse = ref(false)
const showPassword = ref(false)
const copyUsername = (username: string | undefined): void => {
  if (!username) return
  navigator.clipboard
    .writeText(username)
    .then(() => {
      ElMessage.success('复制成功')
    })
    .catch(() => {
      ElMessage.error('复制失败')
    })
}

const showEllipsis = ref(true)
</script>

<template>
  <div>
    <DynamicBreadcrumb />
    <div class="flex items-center justify-between mt-3">
      <div class="flex items-center space-x-3">
        <h1 class="text-3xl font-extrabold">{{ currentPassword?.title }}</h1>
        <el-tag class="ml-3" :color="currentPassword?.category.color">
          <span class="text-white">{{ currentPassword?.category.name }}</span>
        </el-tag>
      </div>
      <div>
        <p class="text-gray-500">上次使用: {{ currentPassword?.lastUsed }}</p>
      </div>
    </div>
    <el-divider />
    <div>
      <el-row :gutter="30">
        <el-col :span="12">
          <div class="flex flex-col space-y-4">
            <div>
              <div class="text-lg font-bold">用户名</div>
              <div class="text-gray-500 flex items-center">
                <p>{{ currentPassword?.username }}</p>
                <p
                  class="text-sm text-gray-400 cursor-pointer mt1 ml2 hover:text-gray-600"
                  @click="copyUsername(currentPassword?.username)"
                >
                  <el-icon>
                    <CopyDocument />
                  </el-icon>
                </p>
              </div>
            </div>
            <div>
              <div class="text-lg font-bold">密码</div>
              <div class="flex items-center text-gray-500">
                <p>{{ showPassword ? currentPassword?.password : '*********' }}</p>
                <p
                  class="text-sm text-gray-400 cursor-pointer mt1 ml2 hover:text-gray-600"
                  @click="showPassword = !showPassword"
                >
                  <el-icon>
                    <component :is="showPassword ? 'Hide' : 'View'" />
                  </el-icon>
                </p>
              </div>
            </div>
            <div>
              <div class="text-lg font-bold">URL</div>
              <div>
                <el-link type="primary" :href="currentPassword?.url" target="_blank">
                  {{ currentPassword?.url }}
                </el-link>
              </div>
            </div>
            <div>
              <div class="text-lg font-bold">备注</div>
              <el-row class="text-gray-500 w-full">
                <el-text :truncated="showEllipsis">{{ currentPassword?.notes }}</el-text>
                <el-text
                  v-if="currentPassword?.notes"
                  type="primary"
                  class="cursor-pointer hover:text-blue-300"
                  @click="showEllipsis = !showEllipsis"
                >
                  <span class="text-xs">{{ showEllipsis ? '展开' : '收起' }}</span>
                </el-text>
              </el-row>
            </div>
            <div>
              <div class="text-lg font-bold">是否收藏</div>
              <div class="text-gray-500 mt1">
                <el-tag v-if="currentPassword?.isFavorite" type="success">是</el-tag>
                <el-tag v-else type="danger">否</el-tag>
              </div>
            </div>
            <div>
              <div class="text-lg font-bold">密码强度</div>
              <div class="text-gray-500">
                <el-rate
                  :model-value="currentPassword?.passwordStrength"
                  disabled
                  void-color="#000000"
                />
              </div>
            </div>
            <div>
              <div class="text-lg font-bold">创建时间</div>
              <div class="text-gray-500">{{ currentPassword?.createdAt }}</div>
            </div>
            <div>
              <div class="text-lg font-bold">更新时间</div>
              <div class="text-gray-500">{{ currentPassword?.updatedAt }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="2">
          <el-divider direction="vertical" class="h-full" />
        </el-col>
        <el-col :span="10">
          <div>
            <div class="flex items-center space-x-4">
              <h2>密码更改历史记录</h2>
              <el-switch
                v-model="isReverse"
                :disabled="!passwordHistory || passwordHistory.length < 2"
              />
            </div>
            <div class="mt4">
              <el-timeline v-if="passwordHistory && passwordHistory.length" :reverse="isReverse">
                <el-timeline-item
                  v-for="(history, index) in passwordHistory.slice().reverse()"
                  :key="index"
                  :timestamp="history.changedAt"
                  placement="top"
                  type="primary"
                  hollow
                >
                  <p class="font-mono break-all text-gray-500">
                    **旧值**: {{ history.decryptedPassword || '（旧密码已加密/不可见）' }}
                  </p>
                </el-timeline-item>
              </el-timeline>
              <el-empty v-else description="暂无历史更改记录" :image-size="100" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="css" scoped>
.el-divider--horizontal {
  border-top-color: #dcdfe6;
}
.el-divider--vertical {
  border-left-color: #dcdfe6;
  min-height: 400px;
}
.el-timeline {
  padding-left: 0;
}
</style>

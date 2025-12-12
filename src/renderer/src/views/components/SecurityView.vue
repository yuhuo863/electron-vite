<template>
  <div>
    <h3 class="font-bold">安全与认证</h3>
    <div class="flex flex-col space-y-4 mt-3">
      <el-card shadow="never">
        <div class="flex flex-col space-y-3">
          <div class="flex justify-between">
            <p>主密码管理</p>
            <el-button
              type="primary"
              icon="Edit"
              text
              size="small"
              @click="router.push('/settings/master-password')"
              >修改</el-button
            >
          </div>
          <div>
            <p class="text-gray-400 text-xs">
              您的主密码是加密您所有数据的唯一密钥。请确保其强度足够高
            </p>
          </div>
        </div>
      </el-card>

      <el-card shadow="never">
        <div class="flex flex-col space-y-3">
          <div class="flex justify-between">
            <p>活动会话</p>
          </div>
          <div>
            <p class="text-gray-400 text-xs">显示当前设备的活动会话信息</p>
          </div>
          <div class="flex flex-col">
            <li class="flex justify-between">
              <div class="flex items-center space-x-3">
                <div>
                  <el-icon><Monitor /></el-icon>
                </div>
                <div class="flex flex-col">
                  <p class="text-sm">
                    设备名称： {{ systemInfo?.type }}{{ systemInfo?.arch }}({{
                      systemInfo?.release
                    }})
                  </p>
                  <p class="text-xs text-gray-500">
                    IP地址： {{ systemInfo?.localIps[0].address }}
                  </p>
                </div>
              </div>
              <div class="flex text-xs items-end">
                <p>登录时间：</p>
                <p>{{ authStore.userInfo?.lastLogin }}</p>
              </div>
            </li>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@renderer/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const systemInfo = ref<SystemInfo>()

const getSystemInfo = async (): Promise<void> => {
  const result = await window.authAPI.getSystemInfo()
  systemInfo.value = result
}

onMounted(async () => {
  await getSystemInfo()
})
</script>

<style scoped></style>

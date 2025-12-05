<script setup lang="ts">
import { ref } from 'vue'

const reverse = ref(false)

const activities = [
  {
    id: 1,
    timestamp: '2025/4/12',
    content: 'Update Github template1',
    author: 'Tom',
    time: '20:55'
  },
  {
    id: 2,
    timestamp: '2025/4/3',
    content: 'Update Github template2',
    author: 'Jerry',
    time: '20:56'
  },
  {
    id: 3,
    timestamp: '2025/4/2',
    content: 'Update Github template3',
    author: 'Jack',
    time: '20:57'
  }
]
</script>

<template>
  <div>
    <h1>系统更新</h1>
    <el-switch v-model="reverse" active-text="reverse" />
    <el-timeline style="max-width: 600px" :reverse="reverse">
      <el-timeline-item
        v-for="activity in activities"
        :key="activity.id"
        :timestamp="activity.timestamp"
        placement="top"
      >
        <el-card>
          <h4>{{ activity.content }}</h4>
          <p>{{ activity.author }} committed {{ activity.time }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<style lang="css" scoped></style>

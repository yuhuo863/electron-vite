<script setup lang="ts">
import { useRoute } from 'vue-router'
import DynamicBreadcrumb from './components/DynamicBreadcrumb.vue'

const route = useRoute()
</script>

<template>
  <div>
    <DynamicBreadcrumb />
    password detail page

    {{ route.params.id }}
  </div>
</template>

<style lang="css" scoped></style>

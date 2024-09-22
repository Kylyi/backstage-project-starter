<script setup lang="ts">
// Types
import type { IOperation } from '~/libs/Operation/types/operation.type'

type IProps = {
  results: IOperation['results']
}

defineProps<IProps>()
</script>

<template>
  <div flex="~ gap-2">
    <!-- Error -->
    <div
      v-if="results.error"
      flex="~ gap-1 items-center"
      color="red-500"
    >
      <div class="i-octicon:x-circle-fill-24" />
      <span>{{ results.error }}</span>
    </div>

    <!-- Warning -->
    <div
      v-if="results.warning"
      flex="~ gap-1 items-center"
      color="amber-500"
    >
      <div class="i-fluent:warning-24-filled" />
      <span>{{ results.warning }}</span>
    </div>

    <!-- Success -->
    <div
      v-if="results.success"
      flex="~ gap-1 items-center"
      color="green-500"
    >
      <div class="i-ep:success-filled" />
      <span>{{ results.success }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Models
import { StatusMapEnum } from '~/libs/App/enums/status-map.enum'

type IProps = {
  clickable?: boolean
  label?: string
  type: StatusMapEnum
}

const props = defineProps<IProps>()

const classes = computedEager(() => {
  switch (props.type) {
    case StatusMapEnum.POSITIVE:
      return 'bg-green-500 color-white'
    case StatusMapEnum.NEGATIVE:
      return 'bg-rose-500 color-white'
    case StatusMapEnum.INACTIVE:
      return 'bg-gray-400 color-white'
    case StatusMapEnum.INFO:
      return 'bg-blue-500 color-white'
    case StatusMapEnum.NOTICE:
      return 'bg-purple-500 color-white'
    case StatusMapEnum.WARNING:
      return 'bg-orange-400 color-white'
    case StatusMapEnum.PENDING:
      return 'bg-secondary color-white'
    default:
      return 'bg-amber-300 color-black'
  }
})
</script>

<template>
  <div
    class="status-strip"
    :class="classes"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.status-strip {
  @apply absolute top-0 left-0 h-full w-1;
}
</style>

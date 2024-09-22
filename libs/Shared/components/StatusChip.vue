<script setup lang="ts">
// Models
import { StatusMapEnum } from '~/libs/App/enums/status-map.enum'

// Components
import Btn from '~/components/Button/Btn.vue'
import Chip from '~/components/Chip/Chip.vue'

type IProps = {
  clickable?: boolean
  label?: string
  type: StatusMapEnum

  /**
   * When inline, the chip will be forced into `inline-flex`, will add some `m-l`
   * and resets the `font-weight`
   *
   * Use when adding to a header or similar
   */
  inline?: boolean
}

const props = defineProps<IProps>()

const componentProps = computedEager(() => {
  const btnProps: Record<string, any> = {
    noUppercase: true,
    noBold: true,
    label: props.label,
  }

  if (props.clickable) {
    btnProps.icon = 'i-line-md:chevron-small-right'
    btnProps.size = 'sm'
  }

  switch (props.type) {
    case StatusMapEnum.POSITIVE:
      return {
        class: 'bg-green-500/30 !border-green-500 !border-2',
        ...btnProps,
      }
    case StatusMapEnum.NEGATIVE:
      return {
        class: 'bg-rose-500/30 !border-rose-500 !border-2',
        ...btnProps,
      }
    case StatusMapEnum.INACTIVE:
      return {
        class: 'bg-gray-400 color-white',
        ...btnProps,
      }
    case StatusMapEnum.INFO:
      return {
        class: 'bg-blue-500 color-white',
        ...btnProps,
      }
    case StatusMapEnum.NOTICE:
      return {
        class: 'bg-purple-500 color-white',
        ...btnProps,
      }
    case StatusMapEnum.WARNING:
      return {
        class: 'bg-orange-400/30 !border-orange-400 !border-2',
        ...btnProps,
      }
    case StatusMapEnum.PENDING:
    default:
      return {
        class: 'bg-amber-300 color-black',
        ...btnProps,
      }
  }
})
</script>

<template>
  <Component
    :is="clickable ? Btn : Chip"
    v-bind="componentProps"
    class="table-column-chip"
    :class="{ 'is-inline': inline }"
  >
    <slot />
  </Component>
</template>

<style lang="scss" scoped>
.table-column-chip {
  @apply rounded-custom self-center text-sm h-8 flex-center;

  &.is-inline {
    @apply m-l-3 font-normal align-top;
    @apply '!inline-flex';
  }
}
</style>

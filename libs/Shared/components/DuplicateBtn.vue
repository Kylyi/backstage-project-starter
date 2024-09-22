<script setup lang="ts">
// Constants
import { LOCALE_DEFAULT } from '~/utils/i18n'

type IProps = {
  modelValue: any
  noLabel?: boolean
  to?: string
}

const props = defineProps<IProps>()

// Utils
const route = useRoute()

// Layout
const label = computed(() => !props.noLabel && $t('general.duplicate'))

const linkToCreateEntity = computed(() => {
  if (props.to) {
    return {
      path: props.to,
      query: {
        ...route.query,
        duplicate: JSON.stringify(props.modelValue),
      },
    }
  }

  return {
    path: `/${$p(route.path, LOCALE_DEFAULT).split('/').filter(Boolean).slice(0, -1).join('/')}/create`,
    query: {
      ...route.query,
      duplicate: JSON.stringify(props.modelValue),
    },
  }
})
</script>

<template>
  <Btn
    icon="i-solar-copy-line-duotone"
    :label
    :to="linkToCreateEntity"
    no-underline
  />
</template>

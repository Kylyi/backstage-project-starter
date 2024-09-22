<script setup lang="ts">
// Config
import { config } from '~/components/config/components-config'
import { LOCALE_DEFAULT } from '~/utils/i18n'

type IProps = {
  /**
   * The path to the documentation page.
   */
  path: keyof typeof config.docs

  /**
   * When there are multiple tabs in the container component, we need to pass
   * the tab name to the documentation path.
   */
  tab?: string
}

const props = defineProps<IProps>()

// Utils
const { $switchLocalePath } = useNuxtApp()

const delocalizedPath = computed(() => {
  return $switchLocalePath(LOCALE_DEFAULT)
})

const documentationPath = computed(() => {
  // Remove query params, e.g. `?page=1&perPage=100`
  const path = delocalizedPath.value.replace(/\?.*$/, '')
  const configPath = config.docs[props.path]

  return `${config.helpRoot}${configPath ?? path}${
    props.tab ? `/${props.tab}` : ''
  }`.replace(/([^:]\/)\/+/g, '$1')
})
</script>

<template>
  <Btn
    preset="HELP"
    external
    :to="documentationPath"
    size="sm"
  />
</template>

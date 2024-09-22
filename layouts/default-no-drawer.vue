<script setup lang="ts">
// Functions
import { config } from '~/components/config/components-config'
import { useLayout } from '~/layouts/functions/useLayout'

// Utils
const { layoutEl, styleVars } = useLayout()
</script>

<template>
  <div
    ref="layoutEl"
    class="layout layout--default"
    :style="styleVars"
  >
    <SessionTimeOut v-if="config.sessionTimeoutMinutes > 0" />

    <Navigation>
      <template #left>
        <Btn
          label-class="label-color"
          icon="custom:logo !h-9 !w-9"
          no-uppercase
          size="auto"
          p="1"
          m="l-2"
          no-dim
          no-bold
          self-center
          no-underline
          :label="$t('app.name')"
          :to="$p('/')"
        />
      </template>
    </Navigation>

    <slot />
  </div>
</template>

<style lang="scss" scoped>
:deep(.label-color) {
  @apply color-transparent bg-clip-text bg-gradient-to-r from-primary via-black to-primary;

  @apply dark:(from-primary via-white to-primary);
}
</style>

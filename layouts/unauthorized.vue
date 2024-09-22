<script setup lang="ts">
// Functions
import { useLayout } from '~/layouts/functions/useLayout'

// Utils
const { layoutEl, styleVars } = useLayout(52)
</script>

<template>
  <div
    ref="layoutEl"
    class="layout layout--default"
    :style="styleVars"
  >
    <Navigation
      no-account-btn
      class="!p-x-5 !p-y-1.5"
    >
      <template #left>
        <AppTitle self-center />
      </template>
    </Navigation>

    <slot />

    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.layout--default {
  @apply w-full mx-auto relative flex flex-col min-h-full h-full 2xl:flex;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('/images/unauthorized-background/480p.webp');

  @screen sm {
    background-image: url('/images/unauthorized-background/hd.webp');
  }

  @screen 2xl {
    background-image: url('/images/unauthorized-background/FullHD.webp');
  }

  @screen 3xl {
    background-image: url('/images/unauthorized-background/4K.webp');
  }

  .environment {
    @apply flex flex-center p-1 rounded-custom color-white;

    span {
      @apply backdrop-brightness-80 w-full h-full text-center p-inherit
        rounded-inherit;
    }
  }

  &::before {
    @apply left-0 border-r-1;
  }

  &::after {
    @apply right-0 border-l-1;
  }
}

:deep(.ps__rail-y) {
  right: unset !important;
  left: 0 !important;
}
</style>

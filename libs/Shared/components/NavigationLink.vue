<script setup lang="ts">
// This is basically a hack for NuxtLink...
// It seems like importing NuxtLink from #components breaks the app
// so explicit v-if/v-else needs to be done
// https://github.com/nuxt/nuxt/issues/13413

type IProps = {
  isLink?: boolean
}

defineProps<IProps>()
</script>

<template>
  <NuxtLink v-if="isLink">
    <slot />
  </NuxtLink>

  <div
    v-else
    cursor="default"
  >
    <slot />
  </div>
</template>

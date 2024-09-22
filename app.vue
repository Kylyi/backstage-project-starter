<script setup lang="ts">
import { config } from '~/components/config/components-config'

// Store
import { useAppStore } from '~/libs/App/app.store'

// Utils
const route = useRoute()
const { isDark } = useTheme()

// Store
const { tempComponent } = storeToRefs(useAppStore())

// Hide last floating element on ESC
onKeyStroke('Escape', () => {
  const lastFloatingElement = document.querySelector(
    '.floating-element:last-child',
  )
  const notificationsElement = document.querySelector('.notifications')
  const hasOngoingNotifications = document.querySelector('.notification-row')

  if (lastFloatingElement && !hasOngoingNotifications) {
    // @ts-expect-error They don't know :)
    lastFloatingElement.hide()
  }

  if (notificationsElement) {
    // @ts-expect-error They don't know :)
    notificationsElement.hide()
  }
})

// Watch for login/logout
const userState = useCurrentUserState()

watch(userState, async account => {
  // Redirect on unauthorized routes
  const meta = Array.isArray(route.meta.middleware)
    ? route.meta.middleware
    : [route.meta.middleware]

  if (!meta.includes('public') && !account) {
    $nav(config.signInPagePath)
  }
}, { immediate: true })

useHead({
  bodyAttrs: {
    class: 'font-sans',
  },
  script: [
    { src: 'https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js' },
  ],
})
</script>

<template>
  <NuxtLayout
    :style="{
      ['--color-theme']: isDark ? 'var(--color-darker)' : 'var(--color-white)',
    }"
  >
    <Notifications />
    <NuxtLoadingIndicator
      color="#1e88e5"
      font="500"
    />
    <NuxtPage />

    <div id="tempComponent">
      <Component
        :is="tempComponent"
        v-if="tempComponent"
      />
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
#tempComponent {
  @apply fixed z--1 pointer-events-none invisible;
  // @apply fixed top-20 right-20;
}
</style>

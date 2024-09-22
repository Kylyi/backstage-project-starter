<script setup lang="ts">
// Breadcrumbs
const breadcrumbs = computed<IBreadcrumb[]>(() => {
  return [
    { label: $t('auth.myProfile') },
  ]
})

provide(breadcrumbsKey, breadcrumbs)

// Utils
const { handleRequest } = useRequest()

// Layout
const userState = useCurrentUserState()

// Data fetching
function fetchAccount() {
  // ...
}
</script>

<template>
  <PageWrapper content-class="flex flex-center">
    <pre>{{ userState }}</pre>
  </PageWrapper>
</template>

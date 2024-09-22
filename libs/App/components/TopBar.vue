<script setup lang="ts">
// Utils
const { pageDrawerClass, pageDrawerStyle } = useEnvTheme()
</script>

<template>
  <div
    class="top-bar-wrapper"
    :class="pageDrawerClass"
    :style="pageDrawerStyle"
  >
    <slot name="breadcrumbs-above" />

    <div class="top-bar-wrapper__header">
      <Breadcrumbs
        relative
        grow
        p="!x-0"
        class="top-bar-wrapper__header-breadcrumbs"
      >
        <template #append>
          <slot name="breadcrumbs-append" />
        </template>
      </Breadcrumbs>

      <LazyAppToolbar />
    </div>

    <slot name="breadcrumbs-below" />

    <!-- Page title -->
    <div class="page-title-wrapper">
      <slot name="title-left" />
      <slot name="title" />
      <slot name="title-right" />
    </div>

    <slot name="title-below" />
  </div>
</template>

<style scoped lang="scss">
.top-bar-wrapper {
  @apply flex flex-col;

  &__header {
    @apply flex gap-2 p-r-1 p-l-2 transition-margin transition-ease-out
      justify-end min-h-12 items-center;

    &-breadcrumbs {
      @apply truncate;
    }
  }

  .page-title-wrapper {
    @apply flex items-center justify-start gap-x-5;
  }
}

.page-drawer:not(.is-open) ~ .page-wrapper {
  .top-bar-wrapper__header {
    @apply p-l-15;
  }
}

.page-drawer:not(.is-mini) ~ .page-wrapper {
  .logo {
    @apply hidden;
  }
}

:deep(.breadcrumbs) {
  margin-top: 4px !important;
}
</style>

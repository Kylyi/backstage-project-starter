<script setup lang="ts">
// Functions
import { config } from '~/components/config/components-config'
import { useLayout } from '~/layouts/functions/useLayout'
import { usePageWidth } from '~/layouts/functions/usePageWidth'

// Components
import PageDrawer from '~/components/Page/PageDrawer.vue'

// Utils
const { layoutEl, styleVars } = useLayout()
const { pageDrawerStyle, pageDrawerClass } = useEnvTheme()
const { isPageWidth } = usePageWidth()
const { isMobile } = useMobile()
const { navigationSections } = useNavigation()

// Layout
const isMini = ref(isMobile.value)
const pageDrawerEl = ref<InstanceType<typeof PageDrawer>>()
const leftDrawer = ref(true)

watch(
  isPageWidth,
  val => {
    nextTick(() => (isMini.value = !val))
  },
  { immediate: true },
)

provide('leftDrawer', leftDrawer)

// Style
// @ts-expect-error Bad VueUse type
const { isOutside } = useMouseInElement(pageDrawerEl)

const contentClass = computed(() => {
  return [
    'relative',
    'min-w-$drawerWidth',
    'max-w-full',
    { '!pointer-events-none': isOutside.value },
  ]
})
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
        <Burger
          v-model="leftDrawer"
          m="l-2"
        />

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

    <PageDrawer
      ref="pageDrawerEl"
      v-model:mini="isMini"
      :model-value="leftDrawer"
      absolute-breakpoint="md"
      absolute-full-width-breakpoint="md"
      :bottom-class="['!border-t-0 !p-0', contentClass]"
      :content-class="contentClass"
    >
      <template #default="{ mini }">
        <!-- Background filler -->
        <div
          class="absolute inset-block-0 left-0 transition-width"
          :class="[
            pageDrawerClass,
            mini ? 'w-$drawerMiniWidth' : 'w-$drawerWidth !lt-md:w-full',
          ]"
          :style="pageDrawerStyle"
        />

        <!-- Navigation -->
        <ScrollArea
          :options="{ suppressScrollX: true }"
          class="!p-l-0"
          grow
        >
          <NavigationLinks
            v-model:mini="isMini"
            :sections="navigationSections"
            p="y-2"
            :class="[mini ? 'p-x-1' : 'p-x-2']"
          />
        </ScrollArea>

        <!-- Environment -->
        <div
          v-if="config.environment && config.environment !== 'production'"
          class="environment"
          :class="mini ? 'w-$drawerMiniWidth' : 'w-$drawerWidth'"
        >
          <span>
            {{ $t(`environment.${config.environment}${mini ? 'Short' : ''}`) }}
          </span>
        </div>
      </template>

      <template #bottom>
        <!-- Background filler -->
        <div
          class="absolute inset-block-0 left-0 transition-width"
          :class="[
            pageDrawerClass,
            isMini ? 'w-$drawerMiniWidth' : 'w-$drawerWidth !lt-md:w-full',
          ]"
          :style="pageDrawerStyle"
        />

        <BottomNavigationLinks v-model:mini="isMini" />
      </template>
    </PageDrawer>

    <slot />
  </div>
</template>

<style lang="scss" scoped>
.layout--default {
  @apply w-full mx-auto relative flex flex-col min-h-full h-full;

  .environment {
    @apply flex flex-center p-1 rounded-custom color-white;

    span {
      @apply backdrop-brightness-80 w-full h-full text-center p-inherit rounded-inherit;
    }
  }

  // &::before,
  // &::after {
  //   @apply fixed h-100vh bg-light-50 dark:bg-dark top-0
  //     z-$zBoundaries;

  //   @screen page {
  //     content: '';
  //     width: calc(calc(100% - var(--pageWidth)) / 2);
  //   }
  // }

  &::before {
    @apply left-0 border-r-1;
  }

  &::after {
    @apply right-0 border-l-1;
  }
}

:deep(.label-color) {
  @apply color-transparent bg-clip-text bg-gradient-to-r from-primary via-black to-primary;

  @apply dark:(from-primary via-white to-primary);
}

aside.is-mini {
  :deep(.ps__rail-y) {
    right: unset !important;

    left: calc(var(--drawerMiniWidth) - 11px) !important;
  }
}
</style>

<script setup lang="ts">
type IProps = {
  mini?: boolean
}

defineProps<IProps>()

// Layout
const isMini = defineModel<boolean>('mini')
</script>

<template>
  <div class="navigation-bottom-links">
    <!-- External links -->
    <!-- <ScrollArea
      :options="{ suppressScrollX: true }"
      class="!p-l-0"
      grow
    >
      <NavigationLinks
        :sections="bottomSections"
        p="y-2"
        no-search
        :mini="mini"
        :class="[mini ? 'p-x-1' : 'p-x-2']"
      />
    </ScrollArea> -->

    <div
      flex="~ col gap-1"
      :class="
        mini
          ? 'w-$drawerMiniWidth p-x-1 flex-center'
          : 'w-$drawerWidth p-x-2 !lt-md:w-full'
      "
    >
      <!-- Theme -->
      <!-- <ThemeToggle
        label-class="color-white m-l-2 !font-size-4"
        :label="mini ? '' : $t(`app.theme.${themeColor}`)"
        size="xs"
        :no-hover-effect="false"
        :container-class="['h-9 p-x-2']"
        :visuals="{
          unchecked: {
            bullet: 'bg-transparent',
            toggle: '!bg-black',
            icon: 'i-material-symbols:dark-mode-outline-rounded color-white !w-34 !h-4',
          },
          checked: {
            bullet: 'bg-transparent',
            icon: 'i-humbleicons:sun color-black !w-4 !h-4',
          },
        }"
      /> -->

      <!-- Compact mode -->
      <Btn
        :icon="isMini ? 'i-lucide:sidebar-open' : 'i-lucide:sidebar-close'"
        :ripple="false"
        p="!x-4"
        @click="isMini = !isMini"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.navigation-bottom-links {
  @apply flex flex-col gap-1 p-b-2 w-full;
}
</style>

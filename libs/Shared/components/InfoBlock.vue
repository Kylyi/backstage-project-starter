<script setup lang="ts">
type IProps = {
  beforeShowFnc?: () => Promise<void> | void
  modelValue?: boolean
  title: string
  noCollapse?: boolean
  icon?: string
  titleClass?: ClassType
  headerClass?: ClassType
}

defineProps<IProps>()
defineEmits<{
  (e: 'before-show'): void
  (e: 'hide'): void
}>()

// Layout
const model = defineModel({ default: true })
</script>

<template>
  <Collapse
    v-if="!noCollapse"
    v-model="model"
    :initial-value="model"
    :padded="false"
    :title="title"
    no-separator
    :header-class="['!min-h-9', headerClass]"
    :before-show-fnc="beforeShowFnc"
    class="collapse"
    max-w="screen-lg"
    @before-show="$emit('before-show')"
    @hide="$emit('hide')"
  >
    <template #header>
      <span
        v-if="icon"
        :class="icon"
        class="icon"
      />

      <span
        class="title"
        :class="titleClass"
      >
        {{ title }}

        <slot name="header-right" />
      </span>
    </template>

    <template #expand-icon>
      <div
        i-majesticons:chevron-right
        transition="duration-150"
        :class="{ 'rotate-90': model }"
        m-l-a
      />
    </template>

    <template #default>
      <slot />
    </template>

    <template #right>
      <slot name="right" />
    </template>
  </Collapse>

  <template v-else>
    <div
      class="collapse"
      rounded="!t-3"
    >
      <div class="title title-uncollapsable">
        <span
          v-if="icon"
          :class="icon"
          class="icon"
        />
        {{ title }}
      </div>
      <slot />
    </div>
  </template>
</template>

<style scoped lang="scss">
.collapse {
  @apply border-blue-50 border-2 rounded-2 dark:border-color-gray-900;
}
.title {
  @apply font-rem-18 select-none font-bold grow;

  &-uncollapsable {
    @apply bg-blue-50 dark:bg-gray-900 rounded-2 h-9 flex items-center
      p-x-4 rounded-b-0 gap-2;
  }
}
.icon {
  @apply color-blue-500 dark:color-blue-700;
}
</style>

<script setup lang="ts">
type IProps = {
  logoClass?: ClassType
  noText?: boolean
}

defineProps<IProps>()
</script>

<template>
  <div class="logo-container">
    <div
      custom:logo
      font="rem-50"
      :class="logoClass"
    />

    <div
      v-if="!noText"
      flex="~ col"
    >
      <span
        text="caption uppercase center"
        font="rem-11"
      >
        {{ $t('app.welcome') }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.logo-container {
  @apply flex flex-center p-2 flex-gap-x-3 items-center;
}
</style>

<script setup lang="ts">
const year = $date().year()
</script>

<template>
  <footer>
    © 2023 - {{ year }} Gentl
  </footer>
</template>

<style lang="scss" scoped>
footer {
  @apply bg-$Navigation-bg flex flex-center font-rem-12;
}
</style>

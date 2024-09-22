<script setup lang="ts">
// Types
import type { IOperation } from '~/libs/Operation/types/operation.type'

// Constants
import { matchEntityPathByEndpoint } from '~/libs/Operation/constants/entity-path-by-endpoint.const'

type IProps = {
  operation: IOperation
}

const props = defineProps<IProps>()
defineEmits<{
  (e: 'open:operation', operation: IOperation): void
  (e: 'download:operation', operation: IOperation): void
}>()

// Layout
const operationInfo = computed(() => {
  const { errors, warnings } = props.operation
  const {
    error: errorCount,
    warning: warningCount,
    success: successCount,
  } = props.operation.results

  if (!errorCount && !warningCount && !successCount) {
    return {
      hasDetail: false,
      text: '',
    }
  }

  const payloadSingleItem
    = props.operation.payload?.[0]?.model || props.operation.payload
  const payloadId = payloadSingleItem?.[props.operation.entityKey || 'id']
  const modifiedText = payloadId
    ? `${$t('operation.modifiedId')}: ${payloadId}`
    : undefined

  const path = matchEntityPathByEndpoint(props.operation.endpoint)?.(payloadId)

  if (errorCount > 1 || warningCount > 1 || successCount > 1) {
    return {
      hasDetail: true,
      text:
        errorCount > 1 || warningCount > 1
          ? $t('operation.multipleIssues')
          : $t('operation.multipleResults'),
    }
  } else if (errorCount === 1) {
    return {
      hasDetail: false,
      modifiedText,
      text: errors?.[0] || '',
      to: path ? $p(path) : undefined,
    }
  } else if (warningCount === 1) {
    return {
      hasDetail: false,
      modifiedText,
      text: warnings?.[0] || '',
      to: path ? $p(path) : undefined,
    }
  } else if (successCount === 1) {
    return {
      hasDetail: false,
      modifiedText,
      to: path ? $p(path) : undefined,
    }
  } else {
    return {
      hasDetail: false,
      text: '',
      to: path ? $p(path) : undefined,
    }
  }
})
</script>

<template>
  <div
    flex="~ gap-2 items-center"
    w="full"
    overflow="hidden"
  >
    <NuxtLink
      v-if="operationInfo.to"
      truncate
      :to="operationInfo.to"
      class="link"
      shrink-0
    >
      {{ operationInfo.modifiedText }}
    </NuxtLink>

    <span class="truncate">
      {{ operationInfo.text }}
    </span>

    <span
      v-if="operationInfo.hasDetail"
      class="link link-opener relative shrink-0 truncate"
      max-w="full"
      rounded="custom"
      m="l-auto"
      @click="$emit('open:operation', operation)"
    >
      {{ $t('operation.detailsShow') }}
    </span>

    <span
      v-else
      class="link link-opener link-opener__single relative shrink-0 truncate"
      max-w="full"
      rounded="custom"
      m="l-auto"
      @click="$emit('download:operation', operation)"
    >
      {{ $t('operation.download') }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.link-opener {
  @apply p-x-2;

  &::before {
    @apply content-empty absolute top-0 left-0 w-3px h-full bg-blue-500
      rounded-l-full;
  }

  &::after {
    @apply content-empty absolute top-0 right-0 w-3px h-full bg-blue-500
      rounded-r-full;
  }

  &__single {
    @apply invisible;

    &::before {
      @apply bg-amber-500;
    }

    &::after {
      @apply bg-amber-500;
    }
  }
}

.vue-recycle-scroller__item-view.hover {
  .link-opener__single {
    @apply visible;
  }
}
</style>

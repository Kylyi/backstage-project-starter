<script setup lang="ts">
// Types
import type { IOperation } from '~/libs/Operation/types/operation.type'

// Functions
import { useDuration } from '~/components/Inputs/DurationInput/functions/useDuration'

type IResponseInfo = {
  errors: string[]
  warnings: string[]
  success: any[]
}

type IProps = {
  operation: IOperation
}

const props = defineProps<IProps>()

// Utils
const { formatDate } = useDateUtils()
const { formatDuration } = useDuration()

// Layout
const tab = ref('errors')

const responseInfo = computed<IResponseInfo>(() => {
  if (!props.operation.payload) {
    return {
      errors: [],
      warnings: [],
      success: [],
    }
  }

  return props.operation.payload.reduce(
    (agg: IResponseInfo, response: any) => {
      if (response.error) {
        Array.isArray(response.error)
          ? agg.errors.push(...response.error)
          : agg.errors.push(response.error)
      } else if (response.warning) {
        Array.isArray(response.warning)
          ? agg.warnings.push(...response.warning)
          : agg.warnings.push(response.warning)
      } else if (response?.model) {
        agg.success.push(response.model)
      }

      return agg
    },
    {
      errors: [],
      warnings: [],
      success: [],
    },
  )
})

const duration = computed(() => {
  const duration = formatDuration(props.operation.duration)

  return `${duration.formatted} ${$t(`general.${duration.unit}Short`)}`
})

tab.value = responseInfo.value.errors.length
  ? 'errors'
  : responseInfo.value.warnings.length
    ? 'warnings'
    : 'success'
</script>

<template>
  <div flex="~ col gap-2">
    <div grid="~ md:cols-3 gap-2">
      <!-- Method -->
      <MiniCard
        :label="$t('operation.method')"
        :value="operation.method"
      >
        <span
          uppercase
          :class="`operation--${operation.method.toUpperCase()}`"
        >
          {{ operation.method }}
        </span>
      </MiniCard>

      <!-- Date -->
      <MiniCard
        :label="$t('operation.start')"
        :value="
          formatDate(operation.date, {
            outputIntlOptions: {
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            },
          })
        "
      />

      <!-- Duration -->
      <MiniCard
        :label="$t('operation.duration')"
        :value="duration"
      />

      <MiniCard
        :label="$t('operation.endpoint')"
        :value="operation.endpoint"
        col="md:span-3"
      />
    </div>

    <!-- Tabs -->
    <Tabs
      v-model="tab"
      nav-class="!p-0 !rounded-0"
      nav-content-class="!p-0"
      no-animation
    >
      <template #errors-label="{ changeFn }">
        <Btn
          :label="`${$t('validation.error', 2)} (${
            responseInfo?.errors?.length
          })`"
          no-uppercase
          size="lg"
          grow
          no-dim
          class="tab--errors tab"
          :class="{ 'is-active': tab === 'errors' }"
          @click="changeFn('errors')"
        />
      </template>

      <template #warnings-label="{ changeFn }">
        <Btn
          :label="`${$t('validation.warning', 2)} (${
            responseInfo?.warnings?.length
          })`"
          no-uppercase
          size="lg"
          grow
          no-dim
          class="tab--warnings tab"
          :class="{ 'is-active': tab === 'warnings' }"
          @click="changeFn('warnings')"
        />
      </template>

      <template #success-label="{ changeFn }">
        <Btn
          :label="`${$t('general.success', 2)} (${
            responseInfo?.success?.length
          })`"
          no-uppercase
          size="lg"
          grow
          no-dim
          class="tab--success tab"
          :class="{ 'is-active': tab === 'success' }"
          @click="changeFn('success')"
        />
      </template>

      <!-- Separator -->
      <template #above>
        <div
          h="1"
          :class="`separator--${tab}`"
        />
      </template>

      <Tab name="errors">
        <OperationDetailTable :rows="responseInfo.errors" />
      </Tab>

      <Tab name="warnings">
        <OperationDetailTable :rows="responseInfo.warnings" />
      </Tab>

      <Tab name="success">
        <OperationDetailTable :rows="responseInfo.success" />
      </Tab>
    </Tabs>
  </div>
</template>

<style scoped lang="scss">
.operation {
  &--PUT {
    @apply color-blue-500;
  }

  &--POST {
    @apply color-green-500;
  }

  &--DELETE {
    @apply color-red-500;
  }
}

.tab {
  @apply '!rounded-b-0';
}

.separator,
.is-active.tab {
  &--errors {
    @apply bg-red-500 color-white;
  }

  &--warnings {
    @apply bg-amber-500 color-white;
  }

  &--success {
    @apply bg-green-500 color-white;
  }
}
</style>

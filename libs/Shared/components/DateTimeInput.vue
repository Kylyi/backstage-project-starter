<script setup lang="ts">
import type { IDateInputProps } from '~/components/Inputs/DateInput/types/date-input-props.type'

type IProps = {
  editable?: boolean
  modelValue?: Datetime

  inputProps?: {
    date?: IDateInputProps & { class?: ClassType }
    time?: IDateInputProps & { class?: ClassType }
  }
}

defineProps<IProps>()

defineEmits<{
  (e: 'update:modelValue', value: Datetime): void
  (e: 'blur'): void
  (e: 'clear'): void
}>()

// Layout
const model = defineModel<Datetime>()

const datetime = computed(() => {
  const isSet = !isNil(model.value)
  const date = $date(model.value)

  return {
    date: isSet ? date.format('YYYY-MM-DD') : undefined,
    time: isSet ? date.format('HH:mm') : undefined,
  }
})

function setValue(payload: { value: Datetime | null, valueType: 'date' | 'time' }) {
  const { value, valueType } = payload
  if (!value) {
    model.value = undefined

    return
  }

  if (valueType === 'date') {
    model.value = $date(
      `${$date(value).format('YYYY-MM-DD')} ${datetime.value.time ?? '00:00'}`,
    )
  } else {
    model.value = $date(
      `${datetime.value.date ?? $date().format('YYYY-MM-DD')} ${value}`,
    )
  }
}
</script>

<template>
  <!-- Date -->
  <DateInput
    :model-value="datetime.date"
    :label="$t('general.date')"
    v-bind="inputProps?.date"
    :readonly="!editable"
    @update:model-value="setValue({ value: $event, valueType: 'date' })"
    @blur="$emit('blur')"
    @clear="$emit('clear')"
  />

  <!-- Time -->
  <TimeInput
    :model-value="datetime.time"
    :label="$t('general.time')"
    v-bind="inputProps?.time"
    :readonly="!editable"
    @update:model-value="setValue({ value: $event, valueType: 'time' })"
    @blur="$emit('blur')"
  />
</template>

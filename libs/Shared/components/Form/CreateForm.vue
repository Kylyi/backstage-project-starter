<script setup lang="ts" generic="T">
import { pascalCase } from 'change-case'
import { config } from '~/components/config/components-config'

// Types
import type { IFormProps } from '~/components/Form/types/form-props.type'

// Functions
import { useFormUtils } from '~/components/Form/functions/useFormUtils'

type IProps = IFormProps & {
  entityName?: string
}

const props = withDefaults(defineProps<IProps>(), {
  focusFirstInput: true,
  hasControls: undefined,
  noSubmit: undefined,
  submitConfirmation: undefined,
  submitDisabled: undefined,
  preventSubmitOnEnter: config.form.props.preventSubmitOnEnter,
})

defineEmits<{
  (e: 'submit', payload?: any): void
  (e: 'update:modelValue', val: any): void
}>()

// Utils
const { duplicate, hasDupe, dupe } = useDuplicate()
const { getFormProps } = useFormUtils()

// Layout
const model = defineModel<T>()
const formProps = getFormProps(props)

// Duplication
// When we provided just the `ID`, we need to fetch the entity to duplicate it
if (props.entityName && hasDupe.value && !duplicate.value.obj) {
  const entityNamePascalCase = pascalCase(props.entityName)
  const apiImport = await import(`~/libs/${entityNamePascalCase}/functions/use${entityNamePascalCase}Api.ts`)
  const api = apiImport[`use${entityNamePascalCase}Api`]()
  const findOne = api[`${props.entityName}FindOne`]

  await dupe(model, { fnc: findOne })
}

// When we provided the object, we can duplicate it directly
else if (duplicate.value.obj) {
  await dupe(model)
}
</script>

<template>
  <Form
    v-bind="formProps"
    :no-controls="formProps.noControls"
    @submit="$emit('submit', $event)"
  >
    <slot />

    <template
      v-if="$slots['submit-before']"
      #submit-before
    >
      <slot name="submit-before" />
    </template>

    <template
      v-if="$slots['submit-after']"
      #submit-after
    >
      <slot name="submit-after" />
    </template>
  </Form>
</template>

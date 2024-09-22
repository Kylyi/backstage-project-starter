<script setup lang="ts" generic="T">
import { kebabCase } from 'change-case'
import { klona } from 'klona/full'
import { config } from '~/components/config/components-config'

// Types
import type { IFormProps } from '~/components/Form/types/form-props.type'

// Functions
import { useFormUtils } from '~/components/Form/functions/useFormUtils'

// Store
import { useAppStore } from '~/libs/App/app.store'

// Components
import CrudBtnDelete from '~/components/Crud/CrudBtnDelete.vue'

type IProps = IFormProps & {
  entity?: { id: number, name: string }
  isEditing?: boolean
  isModified?: boolean
  modelValue: T
  noDelete?: boolean
  noDuplicate?: boolean

  prepareData?: (model: T, options?: { useUndefined?: boolean }) => any
}

const props = withDefaults(defineProps<IProps>(), {
  editControls: true,
  focusFirstInput: true,
  hasControls: undefined,
  noSubmit: undefined,
  submitConfirmation: undefined,
  submitDisabled: undefined,
  preventSubmitOnEnter: config.form.props.preventSubmitOnEnter,
})

defineEmits<{
  (e: 'submit', payload?: any): void
  (e: 'delete'): void
  (e: 'update:isEditing', val: boolean): void
  (e: 'update:modelValue', val: any): void
}>()

defineExpose({
  sync: (_model: any) => {
    originalModel.value = klona(_model ?? model.value)
  },
})

// Utils
const { getFormProps } = useFormUtils()

// Store
const appStore = useAppStore()

// Layout
const deleteBtnEl = ref<ComponentInstance<typeof CrudBtnDelete>>()
const isEditing = defineModel<boolean>('isEditing')
const originalModel = klone(props.modelValue)
const model = defineModel<any>()

const formProps = getFormProps(props)

/**
 * When `editing` is set to `false` we sync the original model with the current model
 */
watch(isEditing, val => {
  if (!val) {
    model.value = klona(originalModel.value)
  } else {
    originalModel.value = klona(model.value)
  }
})

onKeyStroke(['d', 'D'], (ev: KeyboardEvent) => {
  const isFocusedInInput = appStore.isActiveElementInput()

  if (isFocusedInInput) {
    return
  }

  if (!props.noDelete) {
    ev.preventDefault()
    unrefElement(deleteBtnEl as any)?.click()
  }

  ev.preventDefault()
})
</script>

<template>
  <Form
    v-model:is-editing="isEditing"
    v-bind="formProps"
    :no-controls="formProps.noControls"
    @submit="$emit('submit', $event)"
  >
    <slot />

    <!-- Metadata -->
    <!-- <DetailMetadata
      :data="model"
      col="md:span-2"
      max-w="screen-lg"
    /> -->

    <template
      v-if="!noDelete"
      #submit-start
    >
      <CrudBtnDelete
        ref="deleteBtnEl"
        @delete="$emit('delete')"
      >
        <KeyboardShortcut
          char="D"
          class="right-1 top--1 !absolute"
        />
      </CrudBtnDelete>

      <template v-if="entity">
        <HistoryBtn
          :entity-id="entity.id"
          :entity-name="entity.name"
        />

        <DuplicateBtn
          v-if="!noDuplicate"
          :model-value="model"
        />
      </template>
    </template>

    <template
      v-if="$slots['submit-before']"
      #submit-before
    >
      <slot name="submit-before" />
    </template>
  </Form>
</template>

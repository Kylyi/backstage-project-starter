<script setup lang="ts">
import { config } from '~/components/config/components-config'

// Store
import { useAppStore } from '~/libs/App/app.store'

// Components
import TextArea from '~/components/Inputs/TextArea/TextArea.vue'
import MenuConfirmation from '~/components/MenuConfirmation/MenuConfirmation.vue'

const emits = defineEmits<{
  (e: 'ok', payload: { comment: string }): void
}>()

defineExpose({
  hide: () => menuConfirmationEl.value?.hide(),
  show: () => menuConfirmationEl.value?.show(),
})

// Store
const appStore = useAppStore()
const { appState } = storeToRefs(appStore)

// Layout
const menuConfirmationEl = ref<InstanceType<typeof MenuConfirmation>>()
const commentEl = ref<InstanceType<typeof TextArea>>()
const comment = ref('')

// @ts-expect-error Wrong element type
const { height } = useElementSize(commentEl)

const submitConfirmationRequired = computed(() => {
  // When we don't allow people to edit the confirmation we just use whatever is
  // in the config
  const isEditable = config.form.confirmation.editable

  if (!isEditable) {
    return config.form.confirmation.required
  }

  // Otherwise, we use the value from the app state (with fallback to config)
  const isRequired
    = !!appState.value.form?.confirmation?.required
    || config.form.confirmation.required

  return isRequired
})

async function handleSubmit() {
  const isValid = await $z.value.$validate()

  if (isValid) {
    emits('ok', { comment: comment.value })

    menuConfirmationEl.value?.hide()
  }
}

function reset() {
  comment.value = ''
  $z.value.$reset()
}

// Since we use autogrow TextArea, we need to recompute the menu position
// whenever the height of the TextArea changes
watch(height, () => {
  menuConfirmationEl.value?.recomputeMenuPosition()
})

// Validation
const $z = useZod(
  {
    comment: z.unknown().refine(val => {
      if (submitConfirmationRequired.value) {
        return !isNil(val) && val !== ''
      }

      return true
    }),
  },
  { comment },
  { scope: false },
)
</script>

<template>
  <MenuConfirmation
    ref="menuConfirmationEl"
    dense
    no-confirm-btn
    header-class="p-l-3 p-r-1"
    placement="bottom-end"
    :no-overlay="false"
    :no-uplift="false"
    w="100"
    @show="commentEl?.focus()"
    @hide="reset"
  >
    <Form
      p="2"
      :submit-confirmation="false"
      @submit="handleSubmit()"
    >
      <TextArea
        ref="commentEl"
        v-model="comment"
        :label="$t('general.comment', 1)"
        :validation="$z.comment"
        autogrow
        input-class="min-h-20"
      />
    </Form>
  </MenuConfirmation>
</template>

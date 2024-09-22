<script setup lang="ts">
type IServerValidationItem = {
  message: string
  code: string
  attributes: string[]
}

type IServerValidation = {
  errors?: IServerValidationItem[]
  warnings?: IServerValidationItem[]
}

type IProps = {
  modelValue?: boolean
  formValidation?: any
  validation?: IServerValidation
  validationTranslationMap?: Record<string, string>
  validationQueue?: ValidationProcessByField
}

const props = defineProps<IProps>()

// Layout
const isValidationPanelOpen = defineModel({ default: false })
const hasValidationChangedRecently = refAutoReset(false, 1000)
const latestValidity = ref(true)

const noValidations = computed(() => !props.formValidation && !props.validation)

const validationInfo = computed(() => {
  const formValidationWarnings = props.formValidation?.$silentErrors?.length
    ? props.formValidation?.$silentErrors
    : []

  const serverValidationWarnings = props.validation?.warnings?.length
    ? props.validation?.warnings
    : []

  const serverValidationErrors = props.validation?.errors?.length
    ? props.validation?.errors
    : []

  return {
    formWarnings: formValidationWarnings,
    serverWarnings: serverValidationWarnings,
    serverErrors: serverValidationErrors,
    hasWarnings:
      !!formValidationWarnings.length || !!serverValidationWarnings.length,
    hasErrors: !!serverValidationErrors.length,
  }
})

const isNotValid = computed(() => {
  return validationInfo.value.hasErrors || validationInfo.value.hasWarnings
})

function createTimeout(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function focusField(name: string) {
  const validationQueue = props.validationQueue?.[name]

  if (validationQueue) {
    for await (const [queueItem, timeout] of validationQueue) {
      queueItem()

      await createTimeout(timeout || 0)
    }
  }

  const el = document.querySelector(`[name="${name}"]`) as HTMLElement
  el?.focus?.()
}

watch(
  isNotValid,
  isNotValid => {
    if (isNotValid && latestValidity.value) {
      hasValidationChangedRecently.value = true

      latestValidity.value = false
    } else {
      latestValidity.value = true
    }
  },
  { immediate: true },
)
</script>

<template>
  <Drawer
    v-if="isNotValid"
    v-model="isValidationPanelOpen"
    side="right"
    class="validation-panel"
    no-title
    title-class="!h-12 z-1 bg-ca"
    :class="{ 'is-open': isValidationPanelOpen }"
  >
    <!-- Ribbon to open the drawer -->
    <div class="validation-panel__collapse-btn-drawer">
      <Btn
        class="validation-panel__collapse-btn"
        :class="{
          'no-validations': noValidations,
          'validations-okay':
            !validationInfo.hasWarnings && !validationInfo.hasErrors,
          'validations-just-changed': hasValidationChangedRecently,
        }"
        p="!x-1 !y-2"
        flex="~ col !gap-2"
        :rounded="false"
        no-uppercase
        @click="isValidationPanelOpen = !isValidationPanelOpen"
      >
        <!-- Errors counter -->
        <div
          v-if="validationInfo.hasErrors"
          class="counter counter--error"
        >
          {{ validationInfo.serverErrors.length }}

          <Tooltip
            placement="bottom-end"
            :offset="8"
          >
            {{ $t('validation.error', 2) }}
          </Tooltip>
        </div>

        <!-- Warnings counter -->
        <div
          v-if="validationInfo.serverWarnings.length"
          class="counter counter--warning"
        >
          {{ validationInfo.serverWarnings.length }}

          <Tooltip
            placement="bottom-end"
            :offset="8"
          >
            {{ $t('validation.warning', 2) }}
          </Tooltip>
        </div>

        <!-- Form validations counter -->
        <div
          v-if="validationInfo.formWarnings.length"
          class="counter counter--form"
        >
          {{ validationInfo.formWarnings.length }}

          <Tooltip
            placement="bottom-end"
            :offset="8"
          >
            {{ $t('validation.formValidations') }}
          </Tooltip>
        </div>
      </Btn>
    </div>

    <div
      flex="~ col gap-7"
      bg="white dark:darker"
      z="1"
      p="2"
      max-h="60vh"
      overflow="auto"
      rounded="inherit"
    >
      <!-- Server validations - errors -->
      <template v-if="validationInfo.serverErrors.length">
        <div
          flex="~ col gap-1"
          class="errors-container"
        >
          <span
            text="caption"
            font="bold"
          >
            {{ $t('validation.error', 2) }}

            ({{ validationInfo.serverErrors.length }})
          </span>

          <ol>
            <li
              v-for="_validation in validationInfo.serverErrors"
              :key="_validation.code"
              text="caption"
              class="list-inside"
            >
              {{ _validation.message }}
            </li>
          </ol>

          <slot name="validation-under">
            <div
              m="t-2"
              class="info-banner"
            >
              {{ $t('validation.serverValidationExplain') }}
            </div>
          </slot>
        </div>
      </template>

      <!-- WARNINGS -->
      <!-- Server validations - warnings -->
      <template v-if="validationInfo.serverWarnings.length">
        <div
          flex="~ col gap-1"
          p="x-2 b-2"
        >
          <span
            text="caption"
            font="bold"
          >
            {{ $t('validation.warning', 2) }}
            ({{ validationInfo.serverWarnings.length }})
          </span>

          <ol>
            <li
              v-for="_validation in validationInfo.serverWarnings"
              :key="_validation.code"
              text="caption"
              class="list-inside"
            >
              {{ _validation.message }}
            </li>
          </ol>
        </div>
      </template>

      <!-- Form validations -->
      <template v-if="validationInfo.formWarnings.length">
        <div
          flex="~ col gap-1"
          p="x-2 b-2"
        >
          <span
            text="caption"
            font="bold"
          >
            {{ $t('validation.formValidations') }}
            ({{ validationInfo.formWarnings.length }})
          </span>
          <ol>
            <li
              v-for="_validation in validationInfo.formWarnings"
              :key="_validation.$uid"
              text="caption"
              class="list-inside"
            >
              <span
                font="bold"
                class="link"
                @click="focusField(_validation.$propertyPath)"
              >
                {{
                  validationTranslationMap?.[_validation.$propertyPath]
                    || $t(_validation.$propertyPath)
                }}
              </span>
              &nbsp;
              <span>
                {{ _validation.$message }}
              </span>
            </li>
          </ol>
        </div>
      </template>

      <!-- No validations -->
      <Banner
        v-if="noValidations"
        :label="$t('validation.noValidations')"
        type="info"
        icon-center
      />

      <!-- All validations are okay -->
      <Banner
        v-else-if="!validationInfo.hasWarnings && !validationInfo.hasErrors"
        :label="$t('validation.allValidationsOkay')"
        type="success"
        icon-center
      />
    </div>
  </Drawer>
</template>

<style scoped lang="scss">
.validation-panel {
  @apply rounded-l-custom border-l-1 border-y-1 border-ca;

  overflow: visible !important;
  opacity: 1 !important;
  top: unset !important;
  height: unset !important;

  transition:
    opacity ease-out 200ms,
    transform ease-out 200ms,
    margin ease-out 200ms;

  &.is-open {
    transform: translateX(-9px);
  }

  .errors-container {
    @apply bg-red-200/80 dark:dark:bg-red-800/60 p-2 rounded-custom;
  }

  &__collapse-btn {
    @apply bg-amber-500 rounded-l-custom;

    &.validations-just-changed {
      @apply animate-tada;
    }

    &-drawer {
      @apply absolute top-1 left-0 -translate-x-full transition-transform;
    }

    &.no-validations {
      @apply bg-info color-white;
    }

    &.validations-okay {
      @apply bg-positive color-white;
    }
  }

  .counter {
    &--error {
      @apply bg-red-300 dark:bg-red-800 color-white border-2 border-dark-700 black min-w-7
        rounded-custom;
    }

    &--warning {
      @apply bg-white color-amber-500 border-dark-700 black border-2 min-w-7
        rounded-custom;
    }

    &--form {
      @apply bg-white color-purple-500 border-dark-700 black border-2 min-w-7
        rounded-custom;
    }
  }

  .info-banner {
    @apply p-2 border-l-4 bg-white border-ca text-caption;
  }
}
</style>

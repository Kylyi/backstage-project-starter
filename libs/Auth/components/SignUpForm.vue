<script setup lang="ts">
// Types
import type { IAuthJwt } from '~/libs/Auth/types/auth-jwt.type'

type IProps = {
  onSignUp?: (account: IAuthJwt) => any
}

const props = defineProps<IProps>()

// Utils
const { handleRequest } = useRequest()

// Layout
const isLoading = ref(false)

const { model: account } = useRefReset({})

// Methods
async function handleSignUp() {
  isLoading.value = true

  try {
    // const user = ...

    // await props.onSignUp?.(user)
  } catch {
    //
  } finally {
    isLoading.value = false
  }
}

// Validation
const $z = useZod(
  {
    account: z.object({}),
  },
  { account },
)
</script>

<template>
  <Form
    no-grow
    no-shortcuts
    :ui="{
      controlsClass: 'border-t-none rounded-b-custom !bg-transparent !p-x-0',
      noSpacer: true,
      submitWrapperClass: 'grow',
      submitClass: 'grow',
    }"
    p="!0"
    gap="!4"
    :label="$t('auth.signUp')"
    :loading="isLoading"
    @submit="handleSignUp"
  >
    ...
  </Form>
</template>

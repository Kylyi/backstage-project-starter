<script setup lang="ts">
// Types
import type { IAuthJwt } from '~/libs/Auth/types/auth-jwt.type'

type IProps = {
  onSignIn?: (user: IAuthJwt) => any
}

const props = defineProps<IProps>()

// Utils
const { isLoading, handleRequest } = useRequest()

// Layout
const user = ref({ email: '', password: '' })

async function login() {
  // Handle sign in
  // const user = ...

  // props.onSignIn?.(user)
}

const $z = useZod(
  {
    user: z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }),
  },
  { user },
)
</script>

<template>
  <Form
    no-grow
    no-shortcuts
    :ui="{
      controlsClass: 'border-t-none rounded-b-custom !bg-transparent !p-x-0 !p-t-2',
      noSpacer: true,
      submitWrapperClass: 'grow',
      submitClass: 'grow',
    }"
    p="!0"
    gap="!4"
    :prevent-submit-on-enter="false"
    :label="$t('auth.signIn')"
    :loading="isLoading"
    :submit-disabled="!user"
    @submit="login"
  >
    <!-- Email & Sign up -->
    <div flex="~ col gap-1">
      <TextInput
        v-model="user.email"
        :label="$t('auth.email')"
        type="email"
        size="lg"
        :ui="{ inputContainerClass: '!dark:bg-black' }"
        zod="user.email"
      />

      <!-- Sign up -->
      <div flex="~ gap-1 items-center">
        <span text="caption">
          {{ $t('auth.noUser') }}
        </span>

        <NuxtLink
          class="link"
          tabindex="-1"
          color="blue-500 hover:blue-600"
          :to="$p('/auth/sign-up')"
        >
          {{ $t('auth.signUp') }}
        </NuxtLink>
      </div>
    </div>

    <!-- Password & Forgot password -->
    <div flex="~ col gap-1">
      <TextInput
        v-model="user.password"
        :label="$t('auth.password')"
        type="password"
        size="lg"
        :ui="{ inputContainerClass: '!dark:bg-black' }"
        zod="user.password"
      />

      <div flex="~ gap-1 items-center">
        <NuxtLink
          class="link"
          color="blue-500 hover:blue-600"
          :to="$p('/auth/forgotten-password')"
        >
          {{ $t('auth.forgottenPassword') }}
        </NuxtLink>
      </div>
    </div>
  </Form>
</template>

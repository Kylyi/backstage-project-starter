<script setup lang="ts">
import { config } from '~/components/config/components-config'

// Types
import type { IAuthJwt } from '~/libs/Auth/types/auth-jwt.type'

definePageMeta({
  middleware: ['public'],
  layout: 'unauthorized',
})

// Utils
const { init } = useAppInit()

async function onSignUp(user: IAuthJwt) {
  // Handle sign up
}
</script>

<template>
  <PageWrapper
    content-class="flex flex-center"
    :include-top-bar="false"
  >
    <!-- Form -->
    <div class="signUp-form">
      <!-- Header -->
      <div
        flex="~ col center gap-1"
        color="primary"
      >
        <h1
          font="rem-64 bold"
          m="b-0"
        >
          App
        </h1>

        <span font="rem-20 thin">
          by Backstage
        </span>
      </div>

      <SignUpForm
        :on-sign-up
        m="y-4"
      />

      <NuxtLink
        :to="$p(config.signInPagePath)"
        class="link"
        color="blue-500 hover:blue-600"
      >
        {{ $t('auth.backToSignIn') }}
      </NuxtLink>
    </div>
  </PageWrapper>
</template>

<style lang="scss" scoped>
.signUp-form {
  @apply p-8 sm:p-10 md:p-12 lg:p-14 w-125 max-w-95% rounded-8
  bg-white/68 dark:bg-black/68;
}
</style>

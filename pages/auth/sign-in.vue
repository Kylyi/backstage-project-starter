<script setup lang="ts">
// Types
import type { IAuthJwt } from '~/libs/Auth/types/auth-jwt.type'

definePageMeta({
  middleware: ['public', 'redirect-login'],
  layout: 'unauthorized',
})

// Layout
async function onSignIn(account: IAuthJwt) {
  // Stuff to do on sign in
}
</script>

<template>
  <PageWrapper
    content-class="flex flex-center"
    :include-top-bar="false"
  >
    <!-- Form -->
    <div class="signIn-form">
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

      <SignInForm
        m="y-4"
        :on-sign-in
      />
    </div>
  </PageWrapper>
</template>

<style lang="scss" scoped>
.signIn-form {
  @apply p-8 sm:p-10 md:p-12 lg:p-14 w-125 max-w-95% rounded-8
  bg-white/68 dark:bg-black/68;
}
</style>

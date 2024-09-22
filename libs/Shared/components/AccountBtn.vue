<script setup lang="ts">
import { config } from '~/components/config/components-config'

// Components
import MenuProxy from '@/components/MenuProxy/MenuProxy.vue'

// Utils
const { handleRequest } = useRequest()

// Layout
const userState = useCurrentUserState()
const menuEl = ref<InstanceType<typeof MenuProxy>>()

async function handleLogout() {
  // await handleRequest(<logout>)
  userState.value = null

  nextTick(() => {
    $nav(config.signInPagePath)
  })
}
</script>

<template>
  <Btn
    id="account-btn"
    icon="i-carbon:user-avatar-filled-alt w-9 h-9"
    round
    self-center
    size="auto"
    w="11"
    h="11"
    no-uplift
    name="account-btn"
    color="true-gray"
  >
    <div
      v-if="userState"
      bg="white"
      absolute
      rounded="full"
      top="0"
      right="0"
    >
      <div
        i-carbon:checkmark-filled
        bg="green"
        w="5"
        h="5"
      />
    </div>

    <MenuProxy
      ref="menuEl"
      :no-arrow="false"
      placement="bottom-end"
      position="top"
      min-w="!70"
      w="320px"
      max-w="!360px"
      h="!auto"
    >
      <template #title>
        <div flex="~ col grow">
          <span font="semibold">
            [TITLE]
          </span>

          <span text="caption">
            {{ userState?.email }}
          </span>
        </div>
      </template>

      <!-- Account detail - Simple -->
      <template v-if="userState">
        <AccountDetailSimple />

        <Btn
          :label="$t('auth.logout')"
          bg="red"
          color="white"
          no-uppercase
          @click="handleLogout"
        />
      </template>
    </MenuProxy>
  </Btn>
</template>

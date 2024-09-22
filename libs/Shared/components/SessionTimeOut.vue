<script setup lang="ts">
import { config } from '~/components/config/components-config'

// Constants
const WAIT_DURATION_MS = 500

// Utils
const rC = useRuntimeConfig()

// Channel for broadcasting the active/inactive state of the user to show dialog for all sessions
const { data: isUserInactive, post: postUserInactive } = useBroadcastChannel({
  name: 'session-management-channel',
})

// Channel for broadcasting session's idle state
const { data: sessionIdleBroadcast, post: postSessionIdleBroadcast }
  = useBroadcastChannel({
    name: 'session-idle-broadcast-channel',
  })

// Channel for receiving idle state responses from other sessions
const { post: postIdleStateResponse, channel: sessionIdleResponseChannel }
  = useBroadcastChannel({
    name: 'session-idle-response-channel',
  })

const { idle, reset } = useIdle(
  config.sessionTimeoutMinutes * 60_000 + WAIT_DURATION_MS,
)

const isLoginSuccessful = ref(true)
const idleStateFromOtherTabs = ref<string[]>([])

onMounted(() => {
  // We collect all the responses from all the sessions
  sessionIdleResponseChannel.value!.onmessage = e => {
    const state = e.data as boolean

    idleStateFromOtherTabs.value = [
      ...idleStateFromOtherTabs.value,
      state ? 'idle' : 'active',
    ]

    handleSessionTimeout()
  }
})

// When current session gets idle, we broadcast it to other sessions
function broadcastIdleState(skipSendingOwnState?: boolean) {
  setTimeout(() => {
    if (!idleStateFromOtherTabs.value.length) {
      // Session timeout here
      logoutUser()
    }
  }, WAIT_DURATION_MS)

  // For purpose of triggering the watcher
  postSessionIdleBroadcast(generateUUID())
  if (!skipSendingOwnState) {
    sendOwnIdleState()
  }
}

// We send the current session's idle state to other sessions as a response to
// the broadcasted idle state
function sendOwnIdleState() {
  postIdleStateResponse(idle.value)
}

const handleSessionTimeout = useDebounceFn(() => {
  const isAtLeastOneTabActive = idleStateFromOtherTabs.value.includes('active')

  if (!isAtLeastOneTabActive && idle.value) {
    logoutUser()
  }

  idleStateFromOtherTabs.value = []
}, WAIT_DURATION_MS)

function logoutUser() {
  useCookie('_accessToken', {
    domain: rC.public.COOKIE_DOMAIN,
    httpOnly: true,
  }).value = null

  useCookie('_refreshToken', {
    domain: rC.public.COOKIE_DOMAIN,
    httpOnly: true,
  }).value = null

  isUserInactive.value = true
  postUserInactive(isUserInactive.value)
  isLoginSuccessful.value = false
}

// We watch the broadcasted idle state, and react with our own idle state
watch(sessionIdleBroadcast, sendOwnIdleState)

watch(idle, isIdle => {
  if (isIdle) {
    broadcastIdleState() // Broadcast the idle state
  }
})

watch(isLoginSuccessful, isLoggedIn => {
  if (isLoggedIn) {
    isUserInactive.value = false
    postUserInactive(isUserInactive.value)
    reset()
  }
})

watch(isUserInactive, () => {
  if (isUserInactive.value) {
    isLoginSuccessful.value = false
  }
})

useEventListener('beforeunload', () => postUserInactive(idle.value))
</script>

<template>
  <Dialog
    :model-value="(isUserInactive as boolean)"
    persistent
    :transition-duration="500"
    dense
    manual
    no-close
    backdrop-class="backdrop-blur-md"
    :title="$t('auth.sessionExpired')"
    header-class="!bg-primary color-white p-x-3"
  >
    <LoginForm
      v-model:is-login-successfull-dialog="isLoginSuccessful"
      :readonly-fields="{ login: true }"
      auto-focus-field="password"
      p="t-5 x-2"
    />
  </Dialog>
</template>

import { config } from '~/components/config/components-config'

export default defineNuxtRouteMiddleware(async to => {
  const nuxtApp = useNuxtApp()

  const toMeta = Array.isArray(to.meta.middleware)
    ? to.meta.middleware
    : [to.meta.middleware]

  const isPublic = toMeta.includes('public')

  try {
    const userState = useCurrentUserState()

    // If no user is logged in, try to refresh the tokens
    if (!userState.value) {
      // Project specific
    }
  } catch {
    if (isPublic) {
      return
    }

    return navigateTo({
      path: nuxtApp.$localePath(config.signInPagePath),
      query: { redirect: to.fullPath },
    })
  }
})

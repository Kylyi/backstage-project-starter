import { config } from '~/components/config/components-config'

export default defineNuxtRouteMiddleware(to => {
  const nuxtApp = useNuxtApp()

  const currentUserState = useCurrentUserState()
  const toMeta = Array.isArray(to.meta.middleware)
    ? to.meta.middleware
    : [to.meta.middleware]

  if (currentUserState.value) {
    return navigateTo({
      path: nuxtApp.$localePath('/'),
      query: { redirect: to.fullPath },
    })
  } else if (!toMeta.includes('public')) {
    return navigateTo({
      path: nuxtApp.$localePath(config.signInPagePath),
      query: { redirect: to.fullPath },
    })
  }
})

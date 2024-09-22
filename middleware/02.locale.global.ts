// Types
import type { LocaleObject } from '@nuxtjs/i18n'

import {
  LOCALE_DEFAULT,
  LOCALES,
  type PageMapKey,
  PAGES_MAP,
} from '~/utils/i18n'

const LOCALE_CODES = LOCALES.map(l => l.code)
const isInitialized = ref(false)

function getPreferredLocale() {
  const nuxtApp = useNuxtApp()
  const allLocales = nuxtApp.$i18n.locales.value as LocaleObject[]
  const allLocaleCodes = allLocales.map(l => l.code)
  let preferredLocales: string[] = []

  if (import.meta.client) {
    preferredLocales = navigator.languages as string[]
  } else {
    const event = useRequestEvent()
    preferredLocales
      = event?.node.req.headers['accept-language']?.split(';')[0].split(',') ?? []
  }

  return preferredLocales.find(l => allLocaleCodes.includes(l))
}

/**
 * The logic is as follows:
 * 1. If user uses fully valid url, we don't do anything
 */
export default defineNuxtRouteMiddleware(to => {
  const nuxtApp = useNuxtApp()

  if (
    import.meta.server
      || (!nuxtApp.payload.serverRendered && !isInitialized.value)
  ) {
    isInitialized.value = true

    // This will be handled by the auth middleware
    if (to.query.redirect) {
      return
    }

    const isPathMatch = to.matched.length > 0
    const pathLocale = to.path.split('/')[1]
    const hasUrlLocale = LOCALE_CODES.includes(pathLocale)
    const cookieLocale = useCookie('lang').value
    const preferredLocale = cookieLocale ?? getPreferredLocale()
    const allLocales = nuxtApp.$i18n.locales.value as LocaleObject[]
    const localeExists = allLocales.some(l => l.code === pathLocale)
    const cookieLocaleExists = allLocales.some(l => l.code === cookieLocale)
    const shouldRedirectToCookieLocale
      = cookieLocale
      && cookieLocale !== LOCALE_DEFAULT
      && cookieLocaleExists
      && (!hasUrlLocale || (hasUrlLocale && pathLocale !== preferredLocale))

    // When the path locale differs from manually set locale, we redirect to the
    // correct locale
    if (shouldRedirectToCookieLocale) {
      nuxtApp.$i18n.locale.value = cookieLocale

      return navigateTo({
        path: nuxtApp.$localePath(to.path, preferredLocale),
        query: to.query,
        replace: true,
      })
    }

    // When valid locale is present in the URL OR no locale is used and it is valid path
    // we don't need to do anything
    if (isPathMatch) {
      return
    }

    const toPathTrimmed = (
      hasUrlLocale ? to.path.slice(4) : to.path.slice(1)
    ) as PageMapKey
    const mappedPage = PAGES_MAP[toPathTrimmed]?.[LOCALE_DEFAULT]

    // When the path matches the default page definition,
    // we just use that to redirect to the preferred locale
    if (mappedPage && preferredLocale) {
      // @ts-expect-error Type
      nuxtApp.$i18n.locale = preferredLocale

      return navigateTo({
        path: nuxtApp.$localePath(mappedPage, preferredLocale),
        query: to.query,
        replace: true,
      })
    }

    // When incorrect locale is used or no locale is used, we try to find the
    // localized page that matches the path and use the corresponding locale
    if (!localeExists || !hasUrlLocale) {
      const page = Object.values(PAGES_MAP).find(page => {
        const localizedPages = Object.entries(page).find(([_, pagePath]) => {
          return pagePath === `/${toPathTrimmed}`
        })

        return localizedPages
      })

      if (page) {
        const locale = (preferredLocale ?? LOCALE_DEFAULT) as keyof typeof page
        // @ts-expect-error Type
        nuxtApp.$i18n.locale = locale

        return navigateTo({
          path: nuxtApp.$localePath(page[locale], locale),
          query: to.query,
          replace: true,
        })
      }
    }
  }
})

import type { H3Event } from 'h3'
import { LOCALE_DEFAULT, availableLocales } from '~/utils/i18n'

export default defineNitroPlugin(nitroApp => {
  // Set theme & lang
  nitroApp.hooks.hook('render:html', (html, { event }: { event: H3Event }) => {
    const defaultLocale = process.env.NUXT_I18N_DEFAULT_LOCALE || LOCALE_DEFAULT
    const pathLocale = event.req.url?.split('/')[1]
    const pathLocaleExists
      = pathLocale && availableLocales?.includes(pathLocale)
    const preferredBrowserLanguages = event.req.headers['accept-language']
      ?.split(';')[0]
      .split(',')
    const preferredLang = ((preferredBrowserLanguages as string[]) || []).find(
      l => availableLocales?.includes(l),
    )

    const lang
      = (pathLocaleExists ? pathLocale : undefined)
      || preferredLang
      || defaultLocale

    const domain = import.meta.env.COOKIE_DOMAIN

    html.head.push(`
      <script>
        (function () {
          const cookieByName = (document.cookie || '')
            .split(';')
            .reduce((agg, splitCookie) => {
              const [key, value] = splitCookie.split('=')

              if (!key || !value) {
                return agg
              }

              agg[key.trim()] = value.trim()

              return agg
            }, {})

          const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          const setting = cookieByName.theme || (prefersDark ? 'dark' : 'light')
          cookieByName.theme = setting

          Object.keys(cookieByName).forEach(cookieName => {
            const cookieValue = cookieByName[cookieName]

            if (!cookieValue) {
              return
            }

            document.cookie = cookieName + '=' + cookieValue + ';path=/;domain=${domain};'
          })

          document.documentElement.setAttribute('class', setting)
          // document.documentElement.setAttribute('lang', '${lang}')
        })()
      </script>
    `)
  })
})

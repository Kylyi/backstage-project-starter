import type { LocaleObject } from '@nuxtjs/i18n'
import { LOCALE_DEFAULT } from '~/utils/i18n'

export function useLocale() {
  const { locale, locales } = useI18n()

  const localesByCode = computed(() => {
    return (locales.value as LocaleObject[]).reduce<
      Record<string, LocaleObject>
    >((agg, locale) => {
      agg[locale.code] = locale

      return agg
    }, {})
  })

  const localesByIso = computed(() => {
    return (locales.value as LocaleObject[]).reduce<
      Record<string, LocaleObject>
    >((agg, locale) => {
      agg[locale.iso!] = locale

      return agg
    }, {})
  })

  const currentLocale = computed(() => {
    return localesByCode.value[locale.value]
  })

  const currentLocaleIso = computed(() => currentLocale.value.iso!)

  const getLocaleIso = (localeCode: string) => {
    return localesByCode.value[localeCode]?.iso || 'en-US'
  }

  const getLocaleDateFormat = (localeIso: string) => {
    return localesByIso.value[localeIso]?.dateFormat || 'YYYY-MM-DD'
  }

  const getCurrentLocaleDateFormat = () => {
    return getLocaleDateFormat(currentLocale.value.iso!)
  }

  const getLocalePathWithPrefix = (path: string) => {
    const _path = $p(path)

    return currentLocale.value.code === LOCALE_DEFAULT
      ? `/${LOCALE_DEFAULT}${_path}`
      : _path
  }

  return {
    currentLocale,
    currentLocaleIso,
    localesByCode,
    getLocaleIso,
    getLocaleDateFormat,
    getCurrentLocaleDateFormat,
    getLocalePathWithPrefix,
  }
}

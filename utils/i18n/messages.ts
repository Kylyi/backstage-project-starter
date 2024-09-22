import type { LocaleObject } from '@nuxtjs/i18n'
import csCz from '../../i18n/cs-CZ.json'
import enUs from '../../i18n/en-US.json'

// Types

export const messages = {
  'cs-CZ': csCz,
  'en-US': enUs,
}

export const availableLocales = Object.keys(messages)

export const LOCALE_DEFAULT = 'cs-CZ'
export const CURRENCY_DEFAULT = 'CZK'

export const LOCALES: LocaleObject[] = [
  {
    code: 'en-US',
    iso: 'en-US',
    name: 'English',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    icon: 'i-emojione:flag-for-united-kingdom',
  },
  {
    code: 'cs-CZ',
    iso: 'cs-CZ',
    name: 'Čeština',
    dateFormat: 'DD.MM.YYYY',
    currency: 'CZK',
    icon: 'i-emojione:flag-for-czechia',
  },
]

import { datetimeFormats, messages, pluralRules } from './utils/i18n'

type DatetimeFormat = Record<string, Intl.DateTimeFormatOptions>

const DATETIME_FORMAT_BY_LANG = Object.keys(messages).reduce((agg, lang) => {
  agg[lang] = datetimeFormats

  return agg
}, {} as Record<string, DatetimeFormat>)

export default defineI18nConfig(() => ({
  legacy: false,
  messages,
  fallbackLocale: 'en-US',
  pluralRules,
  missingWarn: false,
  datetimeFormats: DATETIME_FORMAT_BY_LANG,
  silentTranslationWarn: true,
  fallbackWarn: false,
}))

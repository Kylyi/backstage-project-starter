import { z } from 'zod'

export default defineNuxtPlugin(() => {
  // Translations for Zod
  z.setErrorMap(zodI18nMap)
})

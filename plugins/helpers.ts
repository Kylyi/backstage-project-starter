// Constants
import { $bp } from '~/libs/App/constants/breakpoints.constant'

export default defineNuxtPlugin(nuxtApp => {
  const dimensions = reactive({
    width: 0,
    height: 0,
  })

  nuxtApp.hook('app:beforeMount', () => {
    useResizeObserver(document?.documentElement, entries => {
      const { width, height } = entries[0].contentRect

      dimensions.width = width
      dimensions.height = height
    })
  })

  return {
    provide: {
      log: (...args: any) => console.log(...args),
      bp: $bp,
      dimensions,
      p: $p,
      nav: $nav,
      $klone: klone,
      $generateUUID: generateUUID,
      toBoldLatin: $toBoldLatin,
      api: $api,
      hide: $hide,
      hasClaim: $hasClaim,
    },
  }
})

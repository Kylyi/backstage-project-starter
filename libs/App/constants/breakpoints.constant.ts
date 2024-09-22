import { useBreakpoints } from '@vueuse/core'

// Breakpoints
export const BREAKPOINTS = Object.freeze({
  'xs': 320,
  'xm': 480,
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536,
  '3xl': 1920,

  'page': 1280,
  'inf': 9999,
})

export const BREAKPOINTS_PX = Object.freeze({
  'xs': '320px',
  'xm': '480px',
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
  '3xl': '1920px',

  'page': '1280px',
  'inf': '9999px',
})

export const $bp = useBreakpoints(BREAKPOINTS)

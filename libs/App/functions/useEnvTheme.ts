// @unocss-include
import type { CSSProperties } from 'vue'

// Style for the `PageDrawer.vue` component based on environment settings
const pageDrawerStyle: CSSProperties = {}
const pageDrawerClass: ClassType = 'dark:bg-true-gray-800 bg-truegray-100'

export function useEnvTheme() {
  return {
    pageDrawerStyle,
    pageDrawerClass,
  }
}

export const PAGES_MAP = {
  'about-us': {
    'en-US': '/about-us',
    'cs-CZ': '/o-nas',
  },
} satisfies Record<string, Record<string, string>>

export type PageMapKey = keyof typeof PAGES_MAP

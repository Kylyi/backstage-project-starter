import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

// Icon loader
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

import { presetIkymat } from './utils/unocss/preset'

// Breakpoints
import { BREAKPOINTS_PX } from './libs/App/constants/breakpoints.constant'

export default defineConfig({
  theme: {
    colors: {
      primary: '#006BB6',
      secondary: '#B6006B',
      tertiary: '#6BB600',
      darker: '#121212',
      positive: '#95CD41',
      negative: '#FC4F4F',
      warning: '#FB923C',
      info: '#60A5FA',
    },
    boxShadow: {
      consistent: '0px 0px 12px 8px rgba(0, 0, 0, 0.05)',
    },
    breakpoints: BREAKPOINTS_PX,
    font: {
      size: {
        '2xs': '0.625rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'md': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
      weight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
  presets: [
    presetIcons({
      scale: 1.2,
      // prefix: '',
      collections: {
        custom: FileSystemIconLoader('./assets/icons', svg => {
          return svg.replace(/[\r\n]/g, '')
        }),
      },
    }),
    presetUno(),
    presetAttributify({ ignoreAttributes: ['size'] }),
    presetTypography(),
    presetIkymat(),
    presetWebFonts({
      provider: 'bunny',
      fonts: {
        sans: {
          name: 'poppins',
          weights: ['400', '500', '600', '700', '900', 'italic'],
        },
        serif: 'DM Serif Display',
        mono: {
          name: 'Ubuntu Mono',
          weights: ['400', '700'],
        },
      },
    }),
  ],
  safelist: [
    'i-emojione:flag-for-czechia',
    'i-emojione:flag-for-serbia',
    'i-emojione:flag-for-united-kingdom',
    'rounded-2',
    'border-2',
  ],
  transformers: [
    transformerDirectives({ applyVariable: ['--apply', '@apply'] }),
    transformerVariantGroup(),
  ],
})

import { writeFileSync } from 'node:fs'
import { resolveConfig } from 'unocss'

// Vite plugins
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// UnoCSS
import config from './unocss.config'

// i18n
import { LOCALE_DEFAULT, LOCALES, PAGES_MAP } from './utils/i18n'

const TITLE_TEMPLATE = '%s | Gentl'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    'nuxt-lodash',
    '@nuxtjs/i18n',
    '@nuxtjs/device',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxtjs/fontaine',
    '@nuxt/eslint',
  ],

  // Modules setup
  // NOTE - There is also i18n.config.ts
  i18n: {
    strategy: 'prefix_and_default',
    skipSettingLocaleOnNavigate: true,
    defaultLocale: LOCALE_DEFAULT,
    detectBrowserLanguage: false,
    customRoutes: 'config',
    pages: PAGES_MAP,
    locales: LOCALES,
  },

  lodash: { prefix: '' },

  eslint: {
    config: {
      standalone: false,
      stylistic: true,
    },
  },

  // CSS https://nuxt.com/docs/api/nuxt-config#css
  css: [
    '~/components/__css/components.theme.scss',
    '~/css/reset.scss',
    '~/css/colors.scss',
    '~/css/typography.scss',
    '~/css/main.scss',
    '~/css/theme.scss',
    '~/css/breakpoints.scss',
    '~/css/zindex.scss',
    '~/css/ripple.scss',
    '~/css/project-specific.scss',
  ],

  unocss: { preflight: false },

  // Experimental features https://nuxt.com/docs/api/nuxt-config#experimental
  experimental: {
    componentIslands: true,
    typedPages: true,
    buildCache: true,
  },

  // Imports https://nuxt.com/docs/api/nuxt-config#imports
  imports: {
    imports: [
      { from: 'vue', name: 'MaybeRefOrGetter', type: true },
      { from: 'uuid', name: 'v4', as: 'uuid' },
      { from: 'zod', name: 'z' },
      { from: '~/components/Breadcrumbs/types/breadcrumb.type', name: 'IBreadcrumb', type: true },
    ],
    dirs: [
      './libs/App/functions/**/*',
      './libs/Shared/functions/**/*',
      './libs/Shared/types',
      './libs/Shared/enums',
      './libs/App/globals',
      './libs/App/utils',
      './libs/App/types',
      './utils/zod',
      './utils/helpers/**/*',
      './components/Notification/functions/**/*',
      './components/Breadcrumbs/provide/**/*',
    ],
  },

  // Typescript https://nuxt.com/docs/api/nuxt-config#typescript
  typescript: {
    // typeCheck: process.env.NODE_ENV === 'development',
    shim: false,
    typeCheck: false,
  },

  // Components https://nuxt.com/docs/api/nuxt-config#components
  components: {
    dirs: [
      { path: './components', pathPrefix: false },
      { path: './libs', pathPrefix: false },
    ],
  },

  // Runtime config https://nuxt.com/docs/api/nuxt-config#runtimeconfig
  runtimeConfig: {
    public: {
      COOKIE_DOMAIN: import.meta.env.NUXT_PUBLIC_COOKIE_DOMAIN,
      FILES_HOST: import.meta.env.FILES_HOST,
      BACKEND_URL: import.meta.env.BACKEND_URL,
      ENV: import.meta.env.NUXT_PUBLIC_ENV,
    },
  },

  features: {
    inlineStyles: false,
  },

  hooks: {
    'build:before': () => {
      console.log('\n')
      console.log('✔ Creating colors.json file...')

      writeFileSync('./libs/App/constants/colors.json', JSON.stringify(resolveConfig(config).theme.colors, null, 2), 'utf8')

      // console.log('✔ Creating safelist of icons....')
      // const carbonIcons = Object.keys(icons).map(icon => `i-carbon:${icon}`)
      // writeFileSync(
      //   './libs/App/constants/icons.json',
      //   JSON.stringify(carbonIcons, null, 2),
      //   'utf8',
      // )
    },
  },

  // App options https://nuxt.com/docs/api/nuxt-config#app
  app: {
    head: {
      titleTemplate: TITLE_TEMPLATE,
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'apple-touch-icon-precomposed', sizes: '57x57', href: 'apple-touch-icon-57x57.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '114x114', href: 'apple-touch-icon-114x114.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '72x72', href: 'apple-touch-icon-72x72.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '144x144', href: 'apple-touch-icon-144x144.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '60x60', href: 'apple-touch-icon-60x60.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '120x120', href: 'apple-touch-icon-120x120.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '76x76', href: 'apple-touch-icon-76x76.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '152x152', href: 'apple-touch-icon-152x152.png' },
        { rel: 'icon', type: 'image/png', sizes: '196x196', href: 'favicon-196x196.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: 'favicon-96x96.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '128x128', href: 'favicon-128.png' },
      ],
      meta: [
        { name: 'application-name', content: '&nbsp;' },
        { name: 'msapplication-TileColor', content: '#FFFFFF' },
        { name: 'msapplication-TileImage', content: 'mstile-144x144.png' },
        { name: 'msapplication-square70x70logo', content: 'mstile-70x70.png' },
        { name: 'msapplication-square150x150logo', content: 'mstile-150x150.png' },
        { name: 'msapplication-wide310x150logo', content: 'mstile-310x150.png' },
        { name: 'msapplication-square310x310logo', content: 'mstile-310x310.png' },
      ],

    },
  },

  // Vite & Vue features https://nuxt.com/docs/api/nuxt-config#vite
  vite: {
    plugins: [nodePolyfills()], // Not sure if this is needed anymore...
  },

  // Dev options
  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },

  devtools: {
    enabled: false,

    timeline: {
      enabled: false,
    },
  },

  // SSR https://nuxt.com/docs/api/nuxt-config#ssr
  ssr: false,

  compatibilityDate: '2024-09-22',
})
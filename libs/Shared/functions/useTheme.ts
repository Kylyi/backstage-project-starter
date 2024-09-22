export function useTheme() {
  const rC = useRuntimeConfig()
  const themeCookie = useCookie('theme', {
    path: '/',
    sameSite: 'lax',
    domain: rC.public.COOKIE_DOMAIN,
  })
  const prefersDark = usePreferredDark()

  const isDark = computed(() => {
    return color.value === 'dark'
  })

  // Utils
  function getColor() {
    if (themeCookie.value) {
      return themeCookie.value
    } else {
      return prefersDark.value ? 'dark' : 'light'
    }
  }

  const color = useState('theme', () => getColor())

  function toggleDark(val?: boolean) {
    let theme: 'dark' | 'light'

    if (val !== undefined) {
      theme = val ? 'dark' : 'light'
    } else {
      theme = color.value === 'dark' ? 'light' : 'dark'
    }

    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add(theme)
    }

    // color.value = theme
    themeCookie.value = theme
  }

  watch(
    [themeCookie, prefersDark],
    () => {
      nextTick(() => (color.value = getColor()))
    },
    { immediate: true },
  )

  return { color, isDark, toggleDark }
}

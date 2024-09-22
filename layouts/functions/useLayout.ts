export function useLayout(initialNavHeight = 0) {
  const layoutEl = ref<HTMLDivElement>()

  // Navigation
  const headerEl = ref<HTMLDivElement>()
  const navHeight = ref(initialNavHeight || 0)

  // Page drawers
  const drawerEls = ref<HTMLElement[]>([])
  const drawerLeftWidth = ref('280px')
  const drawerRightWidth = ref('280px')
  const drawerLeftMiniWidth = ref('64px')
  const drawerRightMiniWidth = ref('64px')

  useResizeObserver(headerEl, () => {
    calculateNavHeight()

    drawerEls.value.forEach(drawerEl => {
      const isLeftDrawer = drawerEl.classList.contains('page-drawer--left')

      // Drawer width
      const drawerVar = isLeftDrawer ? drawerLeftWidth : drawerRightWidth
      const width = getComputedStyle(drawerEl).getPropertyValue('--drawerWidth')
      drawerVar.value = width

      // Mini drawer width
      const drawerVarMini = isLeftDrawer
        ? drawerLeftMiniWidth
        : drawerRightMiniWidth
      const miniWidth = getComputedStyle(drawerEl).getPropertyValue('--drawerMiniWidth')
      drawerVarMini.value = miniWidth
    })
  })

  function calculateNavHeight() {
    const NAVIGATION_PADDING_Y = 4
    const { height = 0 }
      = headerEl.value?.querySelector('.navigation')?.getBoundingClientRect()
      ?? {}

    if (height) {
      navHeight.value = height + NAVIGATION_PADDING_Y * 2
    }
  }

  onMounted(() => {
    setTimeout(() => {
      headerEl.value = document.querySelector(
        'header.navigation-wrapper',
      ) as HTMLDivElement

      drawerEls.value = Array.from(
        document.querySelectorAll('aside.page-drawer'),
      )
    })
  })

  const styleVars = computed(() => {
    return {
      '--navHeight': `${navHeight.value}px`,
      '--drawerLeftWidth': drawerLeftWidth.value,
      '--drawerRightWidth': drawerRightWidth.value,
      '--drawerLeftMiniWidth': drawerLeftMiniWidth.value,
      '--drawerRightMiniWidth': drawerRightMiniWidth.value,
    }
  })

  return {
    layoutEl,
    styleVars,
  }
}

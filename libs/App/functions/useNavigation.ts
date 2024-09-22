// @unocss-include

export function useNavigation() {
  // Utils
  const route = useRoute()

  // Navigation
  const navigationSections = computed(() => {
    return [
      // Dashboard
      {
        id: 'dashboard',
        label: $t('general.dashboard'),
        icon: 'i-ic-round-dashboard',
        to: $p('/'),
        isActive: () => route.meta.dashboard,
      },
    ] as INavigationLink[]
  })

  const bottomSections = computed<INavigationLink[]>(() => {
    return []
  })

  return {
    navigationSections,
    bottomSections,
  }
}

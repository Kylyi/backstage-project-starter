import { $bp } from '~/libs/App/constants/breakpoints.constant'

export function useMobile() {
  const { isMobile: isMobileDevice } = useDevice()

  const isMobile = computed(() => {
    return import.meta.client ? !$bp.page.value : isMobileDevice
  })

  return { isMobile }
}

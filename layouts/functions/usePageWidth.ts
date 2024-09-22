// Constants
import { $bp } from '~/libs/App/constants/breakpoints.constant'

export function usePageWidth() {
  const { $device } = useNuxtApp()

  const isPageWidth = useState<boolean>(
    'isPageWidth',
    () => ($device as any).isDesktop,
  )

  watch(
    $bp.page,
    val => {
      if (import.meta.client) {
        isPageWidth.value = val
      }
    },
    { immediate: true },
  )

  return { isPageWidth }
}

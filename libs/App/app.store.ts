import type { DefineComponent } from 'vue'
import { defineStore } from 'pinia'
import { config } from '~/components/config/components-config'

// Types
import type { IAppState } from '~/libs/App/types/app-state.type'

const activeElement = useActiveElement()

export const useAppStore = defineStore('app', () => {
  const appState = useCookie<IAppState>('appState', {
    default: () => ({
      UserTableIsUserLoggedInFilter: false,
      general: {
        keyboardShortcuts: true,
      },
      form: {
        confirmation: {
          enabled: config.form.confirmation.enabled,
          required: config.form.confirmation.required,
        },
      },
      table: {
        autoSaveSchema: config.table.useLocalStorageForDefaultLayout,
      },
    }),
  })
  const hasUserLeftPage = usePageLeave()

  function setAppState(state: Partial<IAppState>, extend = true) {
    if (extend) {
      const appStateMerged = merge(appState.value, state)

      appState.value = appStateMerged
    } else {
      appState.value = state as IAppState
    }
  }

  // Temporary component
  // Usage: When we need to render a component temporarily to calculate its
  // dimensions (e.g. table cell), we can use this
  const tempComponent = shallowRef<DefineComponent>()

  function setTempComponent(component: DefineComponent) {
    tempComponent.value = component
  }

  // Events history
  const lastPointerDownEvent = ref<PointerEvent>()
  const lastPointerDownEl = ref<HTMLElement>()
  const lastPointerDownType = ref<string>()

  onMounted(() => {
    document.documentElement.addEventListener('pointerdown', ev => {
      lastPointerDownEvent.value = ev
      lastPointerDownEl.value = ev.target as HTMLElement
      lastPointerDownType.value = ev.pointerType
    })
  })

  function isActiveElementInput() {
    return !!(
      activeElement.value?.tagName === 'INPUT'
      || activeElement.value?.tagName === 'TEXTAREA'
      || activeElement.value?.contentEditable !== 'inherit'
    )
  }

  return {
    hasUserLeftPage,
    lastPointerDownEvent,
    lastPointerDownEl,
    lastPointerDownType,

    // Active element
    activeElement,
    isActiveElementInput,

    // Temporary component
    tempComponent,
    setTempComponent,

    // App state
    appState,
    setAppState,
  }
})

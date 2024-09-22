import type { UnwrapRef } from 'vue'
import { klona } from 'klona/full'

type IOptions<T, Transformed = T> = {
  autoSyncFromParent?: boolean
  emitName?: string
  modifyFnc?: (value: T) => Transformed
}

export function useRefReset<T, Transformed = T>(
  initialValue: MaybeRefOrGetter<T>,
  options?: IOptions<T, Transformed>,
) {
  const { autoSyncFromParent, emitName, modifyFnc } = options ?? {}

  const instance = getCurrentInstance()
  let _initialValue = toValue(initialValue)
  const originalValue = ref(klona(_initialValue))

  const model = ref(
    klona(toValue(modifyFnc?.(_initialValue) || _initialValue)),
  ) as Ref<Transformed>

  const extendedModel = extendRef(model, {
    /**
     * Sync the value to the parent
     */
    syncToParent: (model: any, syncOriginalValue = true) => {
      const isModelArray = Array.isArray(toValue(initialValue))

      if (typeof _initialValue === 'object' && !isModelArray) {
        Object.assign(toValue(initialValue) as IItem, model)
      } else if (isModelArray) {
        ;(toValue(initialValue) as any[]).splice(
          0,
          (toValue(initialValue) as any[]).length,
          ...(model || []),
        )
      } else if (isRef(initialValue)) {
        (initialValue as Ref<any>).value = model
      }

      // In some cases, we also need to emit the event for Vue to see the changes
      if (emitName) {
        instance?.emit(emitName, toValue(initialValue))
      }

      // When syncing to parent, we don't necessarily want to also overwrite the original value
      // to eventually be able to reset the model to the actual original value
      if (syncOriginalValue) {
        originalValue.value = klona(toValue(initialValue) as any)
      }
    },

    /**
     * Sync the value from the parent
     */
    syncFromParent: () => {
      _initialValue = toValue(initialValue)
      originalValue.value = klona(toValue(_initialValue) as UnwrapRef<T>)

      reset()
    },

    /**
     * Reset the value to the original value
     */
    reset: () => {
      model.value = klona(originalValueModified.value) as Transformed
    },
  })

  const originalValueModified = computed(() => {
    return modifyFnc?.(originalValue.value as T) || originalValue.value
  })

  /**
   * Check if the model has been modified
   */
  const isModified = computed(() => {
    return !isEqual(originalValueModified.value, model.value)
  })

  // Exposed functions
  function reset() {
    extendedModel.reset()
  }
  function syncFromParent() {
    extendedModel.syncFromParent()
  }
  function syncToParent(_model?: any, syncOriginalValue?: boolean) {
    extendedModel.syncToParent(_model ?? model.value, syncOriginalValue)
  }

  if (autoSyncFromParent) {
    watch(
      () => toValue(initialValue),
      () => syncFromParent(),
      { deep: true },
    )
  }

  return {
    model: extendedModel,
    isModified,
    modifyFnc,
    reset,
    syncFromParent,
    syncToParent,
  }
}

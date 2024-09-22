import { defineStore } from 'pinia'
import { config } from '~/components/config/components-config'

// Types
import type { IOperation } from '~/libs/Operation/types/operation.type'

export const useOperationStore = defineStore(
  'operation',
  () => {
    const operations = ref<IOperation[]>([])

    function addOperation(operation: Omit<IOperation, 'id'> & { id?: string }) {
      operations.value = [
        {
          id: generateUUID(),
          ...operation,
        },
        ...operations.value,
      ]

      operations.value = operations.value.slice(0, config.logging.limit)
    }

    return {
      operations,
      addOperation,
    }
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  },
)

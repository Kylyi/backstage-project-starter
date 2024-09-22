<script setup lang="ts">
import { saveAs } from 'file-saver'

// Types
import type { IOperation } from '../types/operation.type'

type IProps = {
  operation: IOperation
}

defineProps<IProps>()

function handleDownloadOperations(operation: IOperation) {
  // Save as json
  saveAs(
    new Blob([JSON.stringify(operation, null, 2)], {
      type: 'application/json;charset=utf-8',
    }),
    'operations.json'
  )
}
</script>

<template>
  <div
    flex="~ gap-2"
    p="t-2 b-1 l-3 r-1"
  >
    <div
      grow
      flex="~ col"
    >
      <h6
        flex="1"
        text="h6"
        p="r-2"
        truncate
      >
        <span>
          {{ $t(operation?.operationName || '') }}
        </span>
      </h6>

      <span text="caption">{{ $t('operation.details') }}</span>
    </div>

    <div flex="~ gap-1">
      <Btn
        size="sm"
        :label="$t('operation.download')"
        self-start
        @click="handleDownloadOperations(operation)"
      />

      <Btn
        preset="CLOSE"
        size="sm"
        self-start
        @click="$hide"
      />
    </div>
  </div>
</template>

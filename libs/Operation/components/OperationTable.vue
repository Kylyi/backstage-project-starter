<script setup lang="ts">
import { saveAs } from 'file-saver'

// Types
import type { IOperation } from '~/libs/Operation/types/operation.type'
import type { ITableDataFetchFncInput } from '~/components/Table/types/table-query.type'

// Models
import { TableColumn } from '~/components/Table/models/table-column.model'

// Functions
import { useTableDataClient } from '~/components/Table/functions/useTableDataClient'

// Store
import { useOperationStore } from '~/libs/Operation/operation.store'

defineOptions({
  inheritAttrs: false,
})

// Utils
const route = useRoute()
const { handleLocalFetch } = useTableDataClient()

// Store
const { operations } = storeToRefs(useOperationStore())

// Layout
const isOperationDialogOpen = ref(false)
const selectedOperation = ref<IOperation>()

function handleOperationById(operationId: string) {
  navigateTo(
    {
      query: {
        ...route.query,
        operationId,
      },
    },
    { replace: true },
  )
}

function handleOpenOperation(operation: IOperation) {
  selectedOperation.value = operation
  isOperationDialogOpen.value = true

  navigateTo(
    {
      query: {
        ...route.query,
        operationId: operation.id,
      },
    },
    { replace: true },
  )
}

function handleCloseOperation() {
  navigateTo(
    {
      query: {
        ...route.query,
        operationId: undefined,
      },
    },
    { replace: true },
  )
}

function handleDownloadOperations(operation?: IOperation) {
  // Save as json
  saveAs(
    new Blob([JSON.stringify(operation || operations.value, null, 2)], {
      type: 'application/json;charset=utf-8',
    }),
    'operations.json',
  )
}

// Table
const columns = computed(() => [
  // Date
  new TableColumn({
    field: 'date',
    label: $t('operation.date'),
    dataType: 'timestampSimple',
    sort: 'desc',
    sortOrder: 1,
    width: '180px',
  }),

  // Operation name
  new TableColumn({
    field: 'operationName',
    label: $t('operation.operationName'),
    dataType: 'stringSimple',
    format: (_, val) => {
      return $t(val || '')
    },
  }),

  // Results
  new TableColumn({
    field: 'results',
    label: $t('operation.response'),
    width: '120px',
    classes: 'flex-center',
    noFilterSort: true,
  }),

  // Record ID
  new TableColumn({
    field: 'recordId',
    label: $t('operation.recordId'),
    dataType: 'string',
    noFilterSort: true,
    autofitLongestText: false,
  }),

  // Message
  new TableColumn({
    field: 'message',
    label: $t('operation.message'),
    dataType: 'string',
    noFilterSort: true,
    autofitLongestText: false,
  }),
])

watch(
  () => route.query,
  query => {
    const operationId = query.operationId as string

    if (operationId) {
      const operation = operations.value.find(
        operation => operation.id === operationId,
      )

      if (operation) {
        handleOpenOperation(operation)
      }
    }
  },
  { immediate: true },
)

function handleGetData(fetchInputFnc: ITableDataFetchFncInput) {
  return handleLocalFetch(operations.value, fetchInputFnc, {
    take: Number.POSITIVE_INFINITY,
  })
}
</script>

<template>
  <Table
    :get-data="{
      fnc: handleGetData,
      payloadKey: 'rows',
      countKey: 'totalRows',
    }"
    :columns="columns"
    :use-url="false"
    :table-top-functionality="{
      noToolbar: true,
      noLayout: true,
    }"
    v-bind="$attrs"
  >
    <template #subbar-right>
      <Btn
        size="xs"
        :label="$t('operation.downloadAll')"
        @click="handleDownloadOperations()"
      />
    </template>

    <template #results="{ row }">
      <OperationResultChips
        m="x-2"
        :results="row.results"
      />
    </template>

    <template #recordId="{ row }">
      <OperationTableRecordIdCell
        :operation="row"
        @open:operation="handleOperationById(row.id)"
      />
    </template>

    <template #message="{ row }">
      <OperationMessage
        m="x-2"
        :operation="row"
        @open:operation="handleOperationById(row.id)"
        @download:operation="handleDownloadOperations(row)"
      />
    </template>
  </Table>

  <!-- Operation info dialog -->
  <Dialog
    v-model="isOperationDialogOpen"
    manual
    header-class="flex-gap-2"
    w="250"
    h="150"
    dense
    @before-hide="handleCloseOperation"
  >
    <!-- Header -->
    <template #header>
      <OperationDialogHeader
        v-if="selectedOperation"
        :operation="selectedOperation"
      />
    </template>

    <OperationDetail
      v-if="selectedOperation"
      :operation="selectedOperation"
      p="2 t-4"
    />
  </Dialog>
</template>

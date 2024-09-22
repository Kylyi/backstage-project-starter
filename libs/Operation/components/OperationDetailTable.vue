<script setup lang="ts">
// Types
import type { ITableDataFetchFncInput } from '~/components/Table/types/table-query.type'

// Models
import { TableColumn } from '~/components/Table/models/table-column.model'

// Functions
import { useTableDataClient } from '~/components/Table/functions/useTableDataClient'

type IProps = {
  rows: any[]
}

const props = defineProps<IProps>()

// Utils
const { handleLocalFetch } = useTableDataClient()

// Layout
const rows = klone<any[]>(
  props.rows.map(row => {
    row.fuid = generateUUID()

    return row
  }),
)

const columns = computed(() => {
  const fields = uniq(rows.value.flatMap(row => Object.keys(row))) as string[]
  const fieldsWithDataType = fields.map(field => {
    const dataType = rows.value.reduce((agg, row) => {
      const rowValue = get(row, field)

      if (rowValue) {
        agg = `${typeof rowValue}Simple`
      }

      // Check if it's a date
      if (agg === 'stringSimple') {
        const date = new Date(rowValue)

        if (!Number.isNaN(date.getTime())) {
          agg = 'dateSimple'
        }
      }

      return agg
    }, 'string' as ExtendedDataType)

    return {
      field,
      dataType,
    }
  })

  return [
    ...fieldsWithDataType.map(({ field, dataType }) => {
      return new TableColumn({
        field,
        dataType,
        label: field,
        hidden: field === 'fuid',
      })
    }),
  ]
})

function handleGetData(fetchInputFnc: ITableDataFetchFncInput) {
  return handleLocalFetch(rows.value, fetchInputFnc)
}
</script>

<template>
  <Table
    :columns="columns"
    :use-url="false"
    :table-top-functionality="{
      noToolbar: true,
      noLayout: true,
    }"
    row-key="fuid"
    :get-data="{
      fnc: handleGetData,
      payloadKey: 'rows',
      countKey: 'totalRows',
    }"
  />
</template>

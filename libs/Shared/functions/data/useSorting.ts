// Types
import type { ITableOrderBy } from '~/components/Table/types/table-query.type'
import type { IItem } from '~/libs/Shared/types/item.type'

// Models
import type { GroupItem } from '~/libs/Shared/models/group-item.model'
import type { SortItem } from '~/libs/Shared/models/sort-item.model'

type WorkerValue = {
  idx: number
  valueByGroupName: Record<string, any>
  valueByColumnName: Record<string, any>
}

const SORT_MAP = { asc: 1, desc: -1 }

export function useSorting() {
  const sortData = async <T = IItem>(
    rowsRef: MaybeRefOrGetter<Array<T>>,
    columnsRef: MaybeRefOrGetter<Array<SortItem<T> | ITableOrderBy>>,
    groupsRef: MaybeRefOrGetter<Array<GroupItem<T>>> = [],
    useWorker?: boolean,
  ): Promise<Array<T>> => {
    const rows = [...toValue(rowsRef)]
    const cols = toValue(columnsRef)
    const groups = toValue(groupsRef)

    const sortCols = cols
      .filter(col => 'direction' in col || col.sort)
      .map(col => {
        if ('direction' in col) {
          return {
            field: col.field,
            name: col.field,
            sort: col.direction,
            format: undefined,
            sortFormat: undefined,
          }
        }

        return col
      })

    const values = rows.map<WorkerValue>((r, idx) => ({
      idx,
      valueByGroupName: groups.reduce<Record<string, any>>((agg, group) => {
        agg[group.name] = group.sortFormat
          ? group.sortFormat(r)
          : group.format
            ? group.format(r)
            : (get(r, group.field) as string | number | boolean)

        return agg
      }, {}),
      valueByColumnName: sortCols.reduce<Record<string, any>>((agg, col) => {
        agg[col.name as string] = col.sortFormat
          ? col.sortFormat(r)
          : col.format
            ? col.format(r)
            : (get(r, col.field) as string | number | boolean)

        return agg
      }, {}),
    }))

    if (useWorker) {
      workerTerminate()

      const res = await workerFn(values, [
        ...groups.map(g => ({
          name: g.name,
          isGroup: true,
          sort: g.sort,
        })),
        ...sortCols.map(col => ({
          name: col.name as string,
          isGroup: false,
          sort: col.sort,
        })),
      ])

      return res.map(idx => rows[idx])
    }

    values.sort((a, b) => {
      for (let idx = 0; idx < groups.length; idx++) {
        const g = groups[idx]
        const aValue = a.valueByGroupName[g.name]
        const bValue = b.valueByGroupName[g.name]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const stringCompare = aValue.localeCompare(bValue)

          if (stringCompare) {
            return stringCompare * SORT_MAP[g.sort || 'asc']
          }
        } else {
          if (aValue > bValue) {
            return SORT_MAP[g.sort || 'asc'] * 1
          }

          if (aValue < bValue) {
            return SORT_MAP[g.sort || 'asc'] * -1
          }
        }
      }

      for (let idx = 0; idx < sortCols.length; idx++) {
        const s = sortCols[idx]
        const aValue = a.valueByColumnName[s.name as string]
        const bValue = b.valueByColumnName[s.name as string]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const stringCompare = aValue.localeCompare(bValue)

          if (stringCompare) {
            return stringCompare * SORT_MAP[s.sort || 'asc']
          }
        } else {
          if (aValue > bValue) {
            return SORT_MAP[s.sort || 'asc'] * 1
          }

          if (aValue < bValue) {
            return SORT_MAP[s.sort || 'asc'] * -1
          }
        }
      }

      return 0
    })

    return values.map(({ idx }) => rows[idx])
  }

  const { workerFn, workerTerminate } = useWebWorkerFn(
    (
      rows: any,
      sortBy: { name: string, isGroup?: boolean, sort?: 'asc' | 'desc' }[],
    ) => {
      return [...rows]
        .sort((a: any, b: any) => {
          for (let idx = 0; idx < sortBy.length; idx++) {
            const s = sortBy[idx]

            const aValue = s.isGroup
              ? a.valueByGroupName[s.name]
              : a.valueByColumnName[s.name]

            const bValue = s.isGroup
              ? b.valueByGroupName[s.name]
              : b.valueByColumnName[s.name]

            if (typeof aValue === 'string' && typeof bValue === 'string') {
              const stringCompare = aValue.localeCompare(bValue)

              if (stringCompare) {
                return stringCompare * SORT_MAP[s.sort || 'asc']
              }
            } else {
              if (aValue > bValue) {
                return SORT_MAP[s.sort || 'asc'] * 1
              }

              if (aValue < bValue) {
                return SORT_MAP[s.sort || 'asc'] * -1
              }
            }
          }

          return 0
        })
        .map(r => r.idx)
    },
  )

  return { sortData }
}

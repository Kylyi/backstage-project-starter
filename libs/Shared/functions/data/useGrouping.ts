// Models
import type { GroupItem } from '~/libs/Shared/models/group-item.model'

// Types
import type { IItem } from '~/libs/Shared/types/item.type'

export type IGroupedItem<T = IItem> = {
  groupIdx: number

  ref: T
}

export type IGroupRow = {
  class?: Record<string, boolean> | string | string[]
  groupIdx: number

  /**
   * Unique group id in format: `<GROUP_A>_|_<GROUP_B>_....`
   * ~ groups are separated by `_|_`
   */
  id: string
  isGroup: true
  label: string
  name: string
  style?: IItem | string
  summary?: Record<string, any>
  value: unknown

  /**
   * Indexes of rows which are contained in this group
   */
  data: number[]
}

// TODO: Initial collapse does not work in worker
// TODO: Initial collapse does not work for nested groups
export function useGrouping() {
  const groupData = <T>(
    rowsRef: MaybeRefOrGetter<Array<T>>,
    groupsRef: MaybeRefOrGetter<Array<GroupItem<T>>>,
    collapsed: Record<string, boolean> = {},
    useWorker?: boolean,
    isInitialized?: boolean,
  ) => {
    return useWorker
      ? handleGroupDataInWorker<any>(rowsRef, groupsRef, collapsed)
      : handleGroupData(rowsRef, groupsRef, collapsed, isInitialized)
  }

  const handleGroupData = <T>(
    rowsRef: MaybeRefOrGetter<Array<T>>,
    groupsRef: MaybeRefOrGetter<Array<GroupItem<T>>>,
    collapsed: Record<string, boolean>,
    isInitialized?: boolean,
  ) => {
    const rows = toValue(rowsRef)
    const groups = toValue(groupsRef)

    const valuesById: Record<string, IGroupRow> = {}
    const arr: Array<T | IGroupRow> = []

    for (let idx = 0; idx < rows.length; idx++) {
      let isCollapsed = false
      const row = rows[idx]

      let id = ''
      for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
        const group = groups[groupIdx]

        const val = group.format ? group.format(row) : get(row, group.field)
        id += `_|_${val}`
        isCollapsed = !!(
          isCollapsed
          || !!collapsed[id]
          || (!isInitialized && group.initialCollapsed)
        )

        if (!collapsed[id] && !isInitialized && group.initialCollapsed) {
          collapsed[id] = true
        }

        if (valuesById[id] === undefined) {
          const label
            = typeof group.label === 'string'
              ? group.label
              : typeof group.label === 'function'
                ? group.label(val)
                : val

          const g: IGroupRow = {
            id,
            name: group.name,
            label,
            value: val,
            groupIdx,
            isGroup: true,
            data: [],
          }

          valuesById[id] = g
          arr.push(g)

          if (isCollapsed) {
            // Skip rows if they are part of collapsed group
            const nextNonCollapsedRowIdx = rows
              .slice(idx + 1)
              .findIndex((row: any) => {
                const val = group.format
                  ? group.format(row)
                  : get(row, group.field)
                const isGroup = !isNil(groupIdx)

                return id !== (isGroup ? `_|_${val}` : val)
              })

            idx
              = nextNonCollapsedRowIdx > -1
                ? nextNonCollapsedRowIdx + idx
                : rows.length + 1

            break
          }
        }

        valuesById[id].data.push(idx)
      }

      if (!isCollapsed) {
        arr.push(row)
      }
    }

    return arr
  }

  const handleGroupDataInWorker = async <T>(
    rowsRef: MaybeRefOrGetter<Array<T>>,
    groupsRef: MaybeRefOrGetter<Array<GroupItem<T>>>,
    collapsed: Record<string, boolean>,
  ) => {
    const rows = toValue(rowsRef)
    const groups = toValue(groupsRef)

    const rowsRelevantData = rows.map<Record<string, any>>(row => {
      return groups.reduce<Record<string, any>>((agg, group) => {
        const val = group.format ? group.format(row) : get(row, group.field)
        agg[group.name] = val

        return agg
      }, {})
    })

    const arr = await workerFnGroupData(
      rowsRelevantData,
      JSON.parse(JSON.stringify(groups)),
      JSON.parse(JSON.stringify(collapsed)),
    )

    return arr.map(row => {
      if (typeof row === 'object') {
        const group = groups[row.groupIdx]
        row.label
          = typeof group.label === 'string'
            ? group.label
            : typeof group.label === 'function'
              ? group.label(row.value)
              : (row.value as string)

        return row
      }

      return rows[row]
    })
  }

  const { workerFn: workerFnGroupData } = useWebWorkerFn(
    <T>(
      rows: T[],
      groups: GroupItem<T>[],
      collapsed: Record<string, boolean>,
    ) => {
      const valuesById: Record<string, IGroupRow> = {}
      const arr: Array<number | IGroupRow> = []

      for (let idx = 0; idx < rows.length; idx++) {
        const row = rows[idx]
        let isCollapsed = false

        let id = ''
        for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
          const group = groups[groupIdx]

          const val = row[group.name as keyof T]
          id += groupIdx ? `_|_${val}` : val
          isCollapsed = isCollapsed || !!collapsed[id]

          if (valuesById[id] === undefined) {
            const g: IGroupRow = {
              id,
              name: group.name,
              label: '',
              value: val,
              groupIdx,
              isGroup: true,
              data: [],
            }

            valuesById[id] = g
            arr.push(g)

            if (isCollapsed) {
              // Skip rows if they are part of collapsed group
              const nextNonCollapsedRowIdx = rows
                .slice(idx + 1)
                .findIndex((row: any) => {
                  const val = row[group.name as keyof T]

                  return id !== (groupIdx ? `_|_${val}` : val)
                })

              idx
                = nextNonCollapsedRowIdx > -1
                  ? nextNonCollapsedRowIdx + idx
                  : rows.length + idx

              break
            }
          }

          valuesById[id].data.push(idx)
        }

        if (!isCollapsed) {
          arr.push(idx)
        }
      }

      return arr
    },
  )

  return { groupData }
}

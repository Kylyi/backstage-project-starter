import type { FuseOptions } from '@vueuse/integrations/useFuse'
import Fuse from 'fuse.js'
import type { Required } from 'utility-types'

// TYPES
import { klona } from 'klona/full'
import type { IItem, IItemBase } from '~/libs/Shared/types/item.type'

export function removeDots(str: string) {
  return str.replace(/\./g, '')
}

export function removeCommas(str: string) {
  if (typeof str === 'string') {
    return str.replace(/,/g, '')
  }

  return str
}

export function useSearching() {
  const { normalizeText } = useText()

  const searchData = async <T extends IItem>(
    patternRef: MaybeRefOrGetter<string>,
    rowsRef: MaybeRefOrGetter<Array<T>>,
    options: Required<FuseOptions<any>, 'keys'>,
    columnsRef?: MaybeRefOrGetter<Array<IItemBase<T>>>,
    useWorker?: boolean,
  ) => {
    const pattern = toValue(patternRef)
    const rows = toValue(rowsRef)
    const columns = toValue(columnsRef)
    const optionsClone = klona(options)

    if (!pattern) {
      return rows
    }

    // Extract relevant data from the rows based on keys
    // Also resolve possible formats if `format` fnc is present
    const colsByName = columns?.reduce((agg, col) => {
      agg[col.name] = col

      return agg
    }, {} as Record<string | Extract<keyof T, string | number>, IItemBase<T>>)

    const columnsRelevant = (options.keys as unknown as string[]).map(key => {
      const col = colsByName?.[key]
      if (col) {
        return col
      }

      return { name: key, field: key as any }
    })

    const rowsRelevantData = rows.map<Record<string, any>>(row => {
      return columnsRelevant.reduce<Record<string, any>>((agg, col) => {
        agg[removeDots(col.name as string)] = normalizeText(
          removeCommas(
            'format' in col && col.format
              ? col.format(row)
              : get(row, col.field),
          ),
        )

        return agg
      }, {})
    })

    // We need to remove dots from keys, because we've removed them above in the reducer
    // and fuse.js would do it again, so the search would not work properly
    optionsClone.keys = (options.keys as string[]).map(removeDots)

    let filteredIdxes: number[] = []

    if (useWorker) {
      workerTerminate()

      await nextTick()
      filteredIdxes = await workerFn(pattern, rowsRelevantData, optionsClone)
    } else {
      filteredIdxes = handleSearch(pattern, rowsRelevantData, optionsClone)
    }

    return filteredIdxes.map(idx => rows[idx])
  }

  const handleSearchInWorker = (
    pattern: string,
    rowsRelevantData: Record<string, any>[],
    options: Required<FuseOptions<any>, 'keys'>,
  ) => {
    options = { threshold: 0.4, ...options }
    const fuse = new Fuse(rowsRelevantData, options)

    // @ts-expect-error Weird fuse.js typing
    const res = fuse.search(pattern, options)

    return res.map(({ refIndex }) => refIndex)
  }

  const handleSearch = (
    pattern: string,
    items: Record<string, any>[],
    options: Required<FuseOptions<any>, 'keys'>,
  ) => {
    options = { threshold: 0.4, ...options }

    const fuse = new Fuse(items, options)

    // @ts-expect-error Weird fuse.js typing
    return fuse.search(pattern, options).map(({ refIndex }) => refIndex)
  }

  // XXX: Manually check for updates for dependency
  const { workerFn, workerTerminate } = useWebWorkerFn(handleSearchInWorker, {
    dependencies: ['https://cdn.jsdelivr.net/npm/fuse.js@6.6.2'],
    timeout: 1e5, // 100 sec
  })

  return {
    searchData,
  }
}

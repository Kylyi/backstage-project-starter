import { klona } from 'klona/full'
import type { Required } from 'utility-types'

// Types
import type { IItem, IItemBase } from '~/libs/Shared/types/item.type'

// Models
import { ComparatorEnum } from '~/libs/App/enums/comparator.enum'

export class FilterItem<T = IItem> implements IItemBase<T> {
  id: number
  name: string | Extract<keyof T, string | number>
  field: ObjectKey<T>
  dataType: ExtendedDataType = 'string'
  format?: (row: T, value?: any) => string | number | boolean
  filterFormat?: (row: T) => string | number | boolean
  comparator = ComparatorEnum.STARTS_WITH

  /**
   * We might need to filter by a different field than the one displayed,
   * this property is used for that
   */
  filterField?: ObjectKey<T>

  // This is for optimalization purposes in table filters -> after filtering,
  // the FilterItem saves the currently filtered keys to reference them later if I need it
  filteredKeys: Record<string | number, boolean>

  /**
   * When filter is `nonInteractive`, it means that it is not directly accessible
   * in the column filters or anywhere else ~ it must be accessed somehow manually
   */
  nonInteractive?: boolean

  /**
   * This is what we are filtering by
   */
  value?: any

  // This is for cases when we want to create custom filter strings
  // Example: .d5 ~ Friday, .D5 ~ 5th day of the month
  keepOriginal?: boolean

  /**
   * Function to inject the `filterDbQuery` getter to customize it
   */
  customDbQueryFnc?: (
    filterItem: FilterItem<T>,
    query: Record<string, any>
  ) => Record<string, any> | undefined

  get filterDbQuery() {
    if (isEmpty(this.value)) {
      return undefined
    }

    const query: Record<string, any> = {}

    if (this.customDbQueryFnc) {
      return this.customDbQueryFnc(this, query)
    }

    set(query, this.field, {
      [this.comparator]: this.value,
    })

    return query
  }

  constructor(obj: Required<Partial<FilterItem<T>>, 'field'>) {
    this.id = obj.id ?? Date.now() // Sorting purposes
    this.name = obj.name ?? obj.field
    this.field = obj.field
    this.filterField = obj.filterField
    this.format = obj.format
    this.filterFormat = obj.filterFormat
    this.value = klona(obj.value)
    this.comparator = obj.comparator ?? this.comparator
    this.dataType = obj.dataType ?? this.dataType
    this.nonInteractive = obj.nonInteractive

    this.filteredKeys = obj.filteredKeys ?? {}
    this.keepOriginal = obj.keepOriginal
    this.customDbQueryFnc = obj.customDbQueryFnc
  }
}

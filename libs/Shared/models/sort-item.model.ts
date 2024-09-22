import type { Required } from 'utility-types'

export class SortItem<T = any> {
  name: string | Extract<keyof T, string | number>
  field: Extract<keyof T, string | number>
  format?: (row: T) => any
  sort?: 'asc' | 'desc'
  sortFormat?: (row: T) => string | number | boolean
  sortOrder?: number

  constructor(obj: Required<Partial<SortItem<T>>, 'name'>) {
    this.name = obj.name
    this.field = obj.field ?? (obj.name as Extract<keyof T, string | number>)
    this.format = obj.format
    this.sort = obj.sort
    this.sortFormat = obj.sortFormat
    this.sortOrder = obj.sortOrder
  }
}

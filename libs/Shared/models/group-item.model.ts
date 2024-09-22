import type { Required } from 'utility-types'

export class GroupItem<T = any> {
  name: string | Extract<keyof T, string>
  label?: string | ((value: any) => string)
  field: Extract<keyof T, string>
  initialCollapsed?: boolean
  format?: (row: T) => any
  sortFormat?: (row: T) => string | number | boolean
  filterFormat?: (row: T) => any
  sort?: 'asc' | 'desc'
  style?: Record<string, string> | string
  class?: (
    row?: T,
    val?: string | number
  ) => Record<string, boolean> | string | string[]

  constructor(obj: Required<Partial<GroupItem<T>>, 'name'>) {
    this.name = obj.name
    this.label = obj.label
    this.field = obj.field ?? (this.name as Extract<keyof T, string>)
    this.initialCollapsed = obj.initialCollapsed ?? false
    this.format = obj.format
    this.sortFormat = obj.sortFormat
    this.filterFormat = obj.filterFormat
    this.sort = obj.sort
    this.style = obj.style
    this.class = obj.class
  }
}

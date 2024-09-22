export type IItem<T extends object = object> = T & Record<string, any>

export type IItemBase<T = IItem> = {
  name: string | Extract<keyof T, string | number>
  field: ObjectKey<T>
  format?: (row: T, value?: any) => any
}

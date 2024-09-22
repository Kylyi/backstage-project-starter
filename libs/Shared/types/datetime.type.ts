import type dayjs from 'dayjs'

export type Datetime = dayjs.Dayjs | number | string | Date | null | undefined

export type DatetimeStrict = dayjs.Dayjs | number | string | Date

export const DATE_TYPES: ExtendedDataType[] = [
  'date',
  'yearMonth',
  'datetime',
  'timestamp',
  'DateTime',
].flatMap(type => [type, `${type}Simple`] as ExtendedDataType[])

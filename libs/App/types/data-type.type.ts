export type DataType =
  // String
  | 'string'

  // Number
  | 'number'
  | 'percent'
  | 'int'
  | 'long'
  | 'double'

  // Currency
  | 'currency'

  // Duration
  | 'duration'

  // Date
  | 'date'
  | 'datetime'
  | 'yearMonth'
  | 'timestamp'
  | 'DateTime'
  | 'fullDateTime'

  // Time
  | 'time'

  // Boolean
  | 'boolean'
  | 'bool'

type SimpleDataType = `${DataType}Simple`

export type ExtendedDataType = DataType | SimpleDataType

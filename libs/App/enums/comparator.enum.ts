// Project specific
export enum ComparatorEnum {
  // Shared
  EQUAL = 'eq',
  NOT_EQUAL = 'not.eq',
  IN = 'in',
  NOT_IN = 'not.in',

  // String
  LIKE = 'like',
  CONTAINS = 'cs',
  STARTS_WITH = 'stw',
  ENDS_WITH = 'enw',
  NOT_LIKE = 'not.like',
  NOT_CONTAINS = 'not.cs',
  NOT_STARTS_WITH = 'not.stw',
  NOT_ENDS_WITH = 'not.enw',

  // Number
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  GREATER_THAN_OR_EQUAL = 'gte',
  LESS_THAN_OR_EQUAL = 'lte',

  // Boolean
  IS = 'is',
  NOT_IS = 'is.not',

  // Date
  AGO = 'ago',
  NOT_AGO = 'not.ago',
  UNTIL = 'for',
  NOT_UNTIL = 'not.for',

  // Empty
  IS_EMPTY = 'is.$empty',
  NOT_IS_EMPTY = 'is.not.$empty',

  // Special
  IN_EVERY = 'in.every',
  IN_NONE = 'in.none',
}

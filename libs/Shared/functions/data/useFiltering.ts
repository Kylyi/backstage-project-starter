// Types
import type { IItem } from '~/libs/Shared/types/item.type'
import type { ITableFilterItem } from '~/components/Table/types/table-query.type'

// Models
import type { FilterItem } from '~/libs/Shared/models/filter-item'
import { ComparatorEnum } from '~/libs/App/enums/comparator.enum'

// Constants
import { DATE_TYPES } from '~/libs/Shared/types/datetime.type'
import { config } from '~/components/config/components-config'

// TODO: Create worker version
export function useFiltering() {
  // Utils
  const { normalizeText } = useText()

  const filterData = <T = IItem>(
    dataRef: MaybeRefOrGetter<T[]>,
    filtersRef: MaybeRefOrGetter<Array<FilterItem<T> | ITableFilterItem<T>>>,
    rowKey = 'id',
  ) => {
    const data = toValue(dataRef)
    const filters = toValue(filtersRef)

    return data.filter(row => {
      let valid = true

      filters.forEach(f => {
        // Prevent cycle from running unnecessarily
        if (!valid) {
          return
        }

        if ('filteredKeys' in f && !isEmpty(f.filteredKeys)) {
          valid = f.filteredKeys?.[get(row, rowKey) as any]

          return
        }

        let rowValue: any

        if ('format' in f) {
          rowValue
            = f.filterFormat?.(row)
            ?? f.format?.(row, get(row, f.field))
            ?? get(row, f.field)
        } else {
          rowValue = get(row, f.field)
        }

        if (Array.isArray(f.value)) {
          const isAndCondition = f.comparator === ComparatorEnum.IN_EVERY || f.comparator === ComparatorEnum.IN_NONE
          let validInArray = false

          if (!isAndCondition) {
            f.value.forEach(cVal => {
              validInArray = validInArray || handleFilter(f.comparator, rowValue, cVal, f.dataType)
            })
          } else {
            validInArray = validInArray || handleFilter(f.comparator, rowValue, f.value, f.dataType)
          }

          valid = valid && validInArray
        } else {
          valid = valid && handleFilter(f.comparator, rowValue, f.value, f.dataType)
        }

        return valid
      })

      return valid
    })
  }

  const handleFilter = (
    comparator: ComparatorEnum,
    rowValue: any,
    value: any,
    dataType?: ExtendedDataType,
  ) => {
    let valid = true
    let formattedRowValue = rowValue
    let formattedValue = value

    if (dataType) {
      formattedRowValue = parseValue(rowValue, dataType, { dateFormat: 'YYYY-MM-DD' })
      formattedValue = parseValue(value, dataType, { dateFormat: 'YYYY-MM-DD' })
    }

    const textFnc = config.list.props.useToBoldLatin
      ? $toBoldLatin
      : normalizeText

    // Transliteration
    if (dataType === 'string' || dataType === 'stringSimple') {
      formattedRowValue = textFnc(formattedRowValue ?? '') || undefined
      formattedValue = textFnc(formattedValue ?? '') || undefined
    }

    switch (comparator) {
      case ComparatorEnum.STARTS_WITH:
        valid
          = valid
          && textFnc((formattedRowValue || '').toString()).startsWith(
            textFnc((formattedValue || '').toString()),
          )
        break

      case ComparatorEnum.NOT_STARTS_WITH:
        valid
          = valid
          && !textFnc((formattedRowValue || '').toString()).startsWith(
            textFnc((formattedValue || '').toString()),
          )
        break

      case ComparatorEnum.ENDS_WITH:
        valid
          = valid
          && textFnc((formattedRowValue || '').toString()).endsWith(
            textFnc((formattedValue || '').toString()),
          )
        break

      case ComparatorEnum.NOT_ENDS_WITH:
        valid
          = valid
          && !textFnc((formattedRowValue || '').toString()).endsWith(
            textFnc((formattedValue || '').toString()),
          )
        break

      case ComparatorEnum.GREATER_THAN:
        valid = valid && formattedRowValue > formattedValue
        break

      case ComparatorEnum.LESS_THAN:
        valid = valid && formattedRowValue < formattedValue
        break

      case ComparatorEnum.GREATER_THAN_OR_EQUAL:
        valid = valid && formattedRowValue >= formattedValue
        break

      case ComparatorEnum.LESS_THAN_OR_EQUAL:
        valid = valid && formattedRowValue <= formattedValue
        break

      case ComparatorEnum.EQUAL:
        if (dataType && DATE_TYPES.includes(dataType)) {
          return $date(rowValue).isSame($date(value), 'day')
        } else {
          valid = valid && formattedRowValue === formattedValue
        }

        break

      case ComparatorEnum.NOT_EQUAL:
        if (dataType && DATE_TYPES.includes(dataType)) {
          return !$date(rowValue).isSame($date(value), 'day')
        } else {
          valid = valid && formattedRowValue !== formattedValue
        }

        break

      case ComparatorEnum.IS_EMPTY:
        valid = valid && isNil(formattedRowValue)
        break

      case ComparatorEnum.NOT_IS_EMPTY:
        valid = valid && !isNil(formattedRowValue)
        break

      case ComparatorEnum.CONTAINS:
        valid
          = valid
          && textFnc((formattedRowValue || '').toString()).includes(
            textFnc((formattedValue || '').toString()),
          )
        break

      case ComparatorEnum.NOT_CONTAINS:
        valid
          = valid
          && !textFnc((formattedRowValue || '').toString()).includes(
            textFnc((formattedValue || '').toString()),
          )
        break

      case ComparatorEnum.IN:
        valid
          = valid
          && textFnc((formattedRowValue || '').toString()).includes(
            textFnc((formattedValue || '').toString()),
          )
        break

      case ComparatorEnum.IN_EVERY:
        valid = valid
        && Array.isArray(formattedRowValue) && Array.isArray(formattedValue)
        && formattedValue.length === formattedRowValue.length
        && formattedValue.every(val => formattedRowValue.includes(val))
        && formattedRowValue.every(val => formattedValue.includes(val))

        break

      case ComparatorEnum.NOT_IN:
      case ComparatorEnum.IN_NONE:
        valid
          = valid
          && !textFnc((formattedRowValue || '').toString()).includes(
            textFnc((formattedValue || '').toString()),
          )
        break

      case ComparatorEnum.IS:
        valid = valid && formattedRowValue === formattedValue
        break

      case ComparatorEnum.NOT_IS:
        valid = valid && formattedRowValue !== formattedValue
        break

      default:
        valid = valid && formattedRowValue === formattedValue
        break
    }

    return valid
  }

  return { handleFilter, filterData }
}

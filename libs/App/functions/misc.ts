import type { ComponentInternalInstance } from 'vue'
import type { TranslateOptions } from '#i18n'

export type PredictDataTypeOptions = {
  rows: any[]
  field: string
  useSimple?: boolean
}

/**
 * Pretty much `eval`
 * Shouldn't really ever be used, but it's here if we need it...
 */
export function safelyEvaluate(code: string, ...args: any[]) {
  // Create a new function object from the code string
  // eslint-disable-next-line no-new-func
  const evalFunc = new Function(...args.map((_, i) => `arg${i}`), code)

  // Bind the function to the global object (window in a browser)
  // and pass any arguments to the function
  return evalFunc.call(window, ...args)
}

/**
 * Blurs any focused input element
 */
export function blurAnyFocusedInput() {
  const activeElement = useActiveElement()

  if (
    activeElement.value?.tagName === 'INPUT'
    || activeElement.value?.tagName === 'TEXTAREA'
    || activeElement.value?.contentEditable
  ) {
    activeElement.value.blur()
  }
}

/**
 * Will return the name of the current component
 */
export function getComponentName(component?: ComponentInternalInstance | null) {
  if (!component) {
    return
  }

  return (component.type.name || component.type.__name) as string
}

export function changeUrlWithoutHistory(searchParams: string) {
  const currentUrl = new URL(window.location.href)
  currentUrl.search = searchParams

  window.history.pushState(history.state, '', currentUrl.toString())
}

export function predictDataType(
  options: PredictDataTypeOptions,
): ExtendedDataType {
  const { field, rows, useSimple } = options

  return (
    rows.reduce<ExtendedDataType>((dataType, row) => {
      const rowValue = get(row, field)

      if (isNil(rowValue) || !isNil(dataType)) {
        return dataType
      }

      // Check for numbers
      const _isNumeric = isNumeric(rowValue)

      if (_isNumeric) {
        dataType = useSimple ? 'numberSimple' : 'number'

        return dataType
      }

      // Check for dates
      const _isDate = isValidDate(rowValue)

      if (_isDate) {
        dataType = useSimple ? 'dateSimple' : 'date'

        return dataType
      }

      // Check for booleans
      const _isBoolean = isBooleanLike(rowValue)

      if (_isBoolean) {
        dataType = useSimple ? 'booleanSimple' : 'boolean'

        return dataType
      }

      return dataType
    }, null as unknown as ExtendedDataType) || 'string'
  )
}

/**
 * Will take a value, checks for `null`, `undefined`, trims it and returns a
 * string or `null`.
 */
export function cleanValue(value?: any) {
  if (isNil(value)) {
    return null
  }

  const stringValue = String(value).trim()

  return stringValue || null
}

/**
 * Will try to resolve the `.self` key
 *
 * Example:
 * We have the following i18n structure: { status: { self: "Status | Statuses", ... }}
 * We get the key `status` from somewhere (probably BE)
 * The function will then return `Status | Statuses` because it tries to resolve the `.self` key under the given key
 */
export function translateNestedKey(
  key: string,
  nestedKey = 'self',
  plural: number | string = 1,
  options?: TranslateOptions,

  /**
   * NOTE: Use case
   * Let's have the following i18n structure: { xxx: { a: "asdf", b: "qwer", c: { d: "zxcv" }}}
   * We get a key "d" from somewhere (probably BE), but we are not use if it's in the first level
   * of the i18n object or the second one or some other level. We can use an array of prefixes
   * to check for these keys in the structure.
   * So, `key = 'd', prefix = ['xxx', 'xxx.c'] would first try to resolve the `xxx.d` key and if
   * it's not found, it would try to resolve it on the `xxx.c.d` key.
   */
  prefix?: string[],
) {
  const translated = $t(key, plural, options)
  const isSame = key === translated

  if (!isSame) {
    return translated
  }

  if (prefix) {
    const prefixes = Array.isArray(prefix) ? prefix : [prefix]

    for (const prefix of prefixes) {
      let prefixedKey = `${prefix}.${key}`
      const translated = $t(prefixedKey, plural, options)

      if (prefixedKey !== translated) {
        return translated
      }

      prefixedKey = `${prefix}.${key}.${nestedKey}`
      const translatedNested = $t(prefixedKey, plural, options)

      if (prefixedKey !== translatedNested) {
        return translatedNested
      }
    }
  } else {
    const translatedNested = $t(`${key}.${nestedKey}`, plural, options)
    const isSameNested = key === translatedNested

    if (!isSameNested) {
      return translatedNested
    }
  }

  return translated
}

export function makeSelectorOptionsFromEnum(
  enumObj: IItem,
  translationPrefix: string,
  options?: {
    keyField?: string
    labelField?: string

    transformKey?: (key: string) => string

    /**
     * If set to true, the value will be parsed to integer
     */
    numericValue?: boolean
  },
): any[] {
  const {
    keyField = 'id',
    labelField = 'label',
    numericValue = true,
    transformKey = (key: string) => key,
  } = options || {}

  const enumValues = Object.values(enumObj)
  const isNumberedEnum = enumValues.some(key => Number.isFinite(Number(key)))

  if (isNumberedEnum) {
    return enumValues
      .filter(key => Number.isFinite(Number(key)))
      .map(key => {
        return {
          [labelField]: $t(`${translationPrefix}.${key}`),
          [keyField]: numericValue ? Number.parseInt(key) : transformKey(key),
        }
      })
  } else {
    return Object.keys(enumObj).map(key => {
      return {
        [labelField]: $t(`${translationPrefix}.${transformKey(key)}`),
        [keyField]: key,
      }
    })
  }
}

/**
 * Will remove all `null` and `undefined` values from the object
 */
export function cleanObject(obj?: IItem | null) {
  if (!obj) {
    return {}
  }

  return Object.entries(obj).reduce((agg, [key, value]) => {
    if (!isNil(value)) {
      agg[key] = value
    }

    return agg
  }, {} as IItem)
}

/**
 * Moves an item from one position to another in provided array
 */
export function moveItem<T>(
  arrayRef: MaybeRefOrGetter<T[]>,
  fromIndex: number,
  toIndex: number,
): T[] {
  const array = toValue(arrayRef)

  if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) {
    throw new Error('Index out of bounds')
  }

  // Remove the item from the original position
  const item = array[fromIndex]
  let newArray = array.toSpliced(fromIndex, 1)

  // Insert the item into the new position
  newArray = newArray.toSpliced(toIndex, 0, item)

  return newArray
}

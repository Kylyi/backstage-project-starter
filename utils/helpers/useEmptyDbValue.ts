export const EMPTY_DB_VALUE = '__<empty>__'

export function useEmptyDbValue() {
  function resolveEmptyDbValue(value: string | null, defaultValue = '') {
    return value === EMPTY_DB_VALUE ? defaultValue : (value as string)
  }

  return { resolveEmptyDbValue }
}

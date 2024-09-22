// Types
import type { ITableQuery } from '~/components/Table/types/table-query.type'

export function transformToPrismaSelect(select?: ITableQuery['select']) {
  if (!select) {
    return undefined
  }

  const transformedSelect: Record<string, any> = {}

  for (const field of select) {
    const fieldParts = field.split('.')
    const fieldWithSelect = fieldParts.join('.select.')

    set(transformedSelect, fieldWithSelect, true)
  }

  return transformedSelect
}

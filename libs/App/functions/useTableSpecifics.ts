// Types
import type { ITableLayout } from '~/components/Table/types/table-layout.type'
import type { IQueryBuilderRow } from '~/components/QueryBuilder/types/query-builder-row-props.type'
import type { ITableDataFetchFncInput } from '~/components/Table/types/table-query.type'

// Models
import type { TableColumn } from '~/components/Table/models/table-column.model'
import type { FilterItem } from '~/libs/Shared/models/filter-item'

// Functions
import type { parseSortingFromUrl } from '~/libs/App/functions/table/extractSortingFromUrl'

type ExtendParseUrlParamsFnc =
  | ((options: {
    searchParams: URLSearchParams
    tableColumns?: TableColumn[]
    queryBuilder: IQueryBuilderRow[]
    filters: IQueryBuilderRow[]
    columns: string[]
    sort: Array<Pick<TableColumn, 'field' | 'sort' | 'sortOrder'>>
    schemaSort: ReturnType<typeof parseSortingFromUrl>
    fromSchema?: boolean

    /**
     * When true, we allow all the values from the schema to be parsed, not
     * just those from `columns`
     */
    allowAnyNonStandardFilter?: boolean

    parseUrlFnc: (options: {
      columnsRef?: MaybeRefOrGetter<TableColumn[]>
      searchParams?: URLSearchParams | string
      fromSchema?: boolean
    }) => {
      sort: Array<Pick<TableColumn, 'field' | 'sort' | 'sortOrder'>>
      schemaSort: ReturnType<typeof parseSortingFromUrl>
      filters: IQueryBuilderRow[]
      queryBuilder: IQueryBuilderRow[]
      columns: string[]
    }
  }) => {
    sort: Array<Pick<TableColumn, 'field' | 'sort' | 'sortOrder'>>
    schemaSort: ReturnType<typeof parseSortingFromUrl>
    filters: IQueryBuilderRow[]
    queryBuilder: IQueryBuilderRow[]
    columns: string[]
  })
  | undefined

/**
 * This composition function contains methods that are specific to the project.
 * Each project should implement their own version of this function.
 */
export function useTableSpecifics() {
  const currentUser = useCurrentUserState().value

  /**
   * Saves the layout via API
   */
  function saveLayout(
    layout: Partial<ITableLayout>,
    toSave: Array<'columns' | 'filters' | 'sorting'>,
    options?: {
      mode?: 'create' | 'update'
      tableQuery?: ITableDataFetchFncInput
    },
  ) {
    const { tableQuery } = options || {}

    const queryParams = tableQuery?.queryParams || new URLSearchParams()
    const paramsToSave = new URLSearchParams()

    // Columns
    if (toSave.includes('columns') && queryParams.has('select')) {
      paramsToSave.set('select', `${queryParams.get('select')}`)
    }

    // Sort
    if (toSave.includes('sorting') && queryParams.has('order')) {
      // We need to extract only the `sort` part of the `paging` query param
      const sortPart = queryParams.get('paging')

      if (sortPart) {
        paramsToSave.set('paging', sortPart)
      }
    }

    // Query builder and filters
    if (toSave.includes('filters')) {
      // Column filters
      if (queryParams.has('filters')) {
        paramsToSave.set('filters', `${queryParams.get('filters')}`)
      }

      // Query builder filters
      if (queryParams.has('qb')) {
        paramsToSave.set('qb', `${queryParams.get('qb')}`)
      }
    }

    layout.schema = decodeURIComponent(paramsToSave.toString())

    const payload = {
      name: layout.name!,
      schema: layout.schema,
      tableName: layout.tableName!,
    }

    // Project specific - save the layout via API
    return payload
  }

  /**
   * Deletes the layout via API
   */
  async function deleteLayout(id?: number | string, tableName?: string) {
    if (!id || !tableName) {
      throw new Error('id and tableName are required')
    }

    // Project specific - delete the layout via API
    return id
  }

  function getTableMetadata(tableName: string) {
    const currentUser = useCurrentUserState().value

    // Project specific - get the table metadata via API
    return {}
  }

  /**
   * For some columns in combination with specific Comparator,
   * we use a custom filter component
   */
  function getCustomFilter(
    col: TableColumn,
    filter?: Pick<FilterItem, 'comparator'>,
  ): TableColumn['filterComponent'] | undefined {
    const { field } = col

    return undefined
  }

  /**
   * Extends the `parseUrlParams` function to include project-specific logic
   * For example, we need to parse the query builder params based on
   * `and` and `or` keys
   */
  const extendParseUrlParams: ExtendParseUrlParamsFnc
    = undefined as ExtendParseUrlParamsFnc

  return {
    getTableMetadata: undefined as any,
    saveLayout,
    deleteLayout,
    getCustomFilter,
    extendParseUrlParams,
  }
}

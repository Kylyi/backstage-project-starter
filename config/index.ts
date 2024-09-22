// @unocss-include
import type { DefineComponent } from 'vue'

// Types
import type {
  ITableDataFetchFncInput,
  ITableQuery,
} from '../components/Table/types/table-query.type'

import type { ISelectorProps } from '../components/Selector/types/selector-props.type'
import type { IServerValidationItem } from '../libs/Shared/types/validation.type'
import type { ITableProps } from '../components/Table/types/table-props.type'
import type { IPageWrapperProps } from '../components/Page/types/page-wrapper-props.type'
import type { ISectionProps } from '../components/Section/types/section-props.type'
import type { IListProps } from '../components/List/types/list-props.type'

// Models
import type { ComparatorEnum } from '../libs/App/enums/comparator.enum'

// Config
import { SHARED_CONFIG } from './shared'
import production from './production.json'
import local from './local.json'
import docs from './documentation.json'

const CONFIG_MAP = { production, local }

const environment: keyof typeof CONFIG_MAP = import.meta.env.NUXT_PUBLIC_ENV || 'local'
const json_config = CONFIG_MAP[environment]

export const appConfig = {
  ...SHARED_CONFIG,

  // General
  environment,
  removePipes: false,
  signInPagePath: '/auth/sign-in',

  // API
  apiRoot: json_config.api.root,
  helpRoot: json_config.api.help,

  // Documentation links
  docs,

  // Environment color
  environmentColor: undefined,

  // Table
  table: {
    props: {
      infiniteScroll: true,
      noSearch: false,
      noLock: false,
    } as Partial<ITableProps>,

    /**
     * When true, the scheme can be saved as default
     */
    canSaveLayoutAsDefault: true,

    /**
     * If true, the `localStorage` will be used to load the last used layout when no layout is specified by the API
     */
    useLocalStorageForDefaultLayout: true,

    /**
     * If true, the metadata in `localStorage` will be checked first before eventually fetching from the API
     */
    useLocalStorageForMetaFirst: false,

    /**
     * Settings for the column auto-fit feature
     */
    columnAutoFit: {
      rowsLimit: 1000, // The amount of rows to use to calculate the column width
      maxColumnWidthChars: 100,
      considerHeader: true,
    },

    /**
     * Creates a query string from the table query object
     */
    getQuery: (query: ITableQuery) => {
      return serializeTableQueryToQueryParams(query)
    },

    /**
     * Extends the `fetchInput` object with project specific logic
     */
    extendTableFetchInput: (fetchInput: ITableDataFetchFncInput) => {
      return fetchInput
    },

    /**
     * Extracts data from the result of `getData` function and provides it for the table
     *
     * Usage: Let's say the API returns a property `shouldBeExportable: boolean`
     * and we're using the slots in `TableTop` to add the export button. This button should
     * be visible only when `shouldBeExportable` is true. This fuction can be used to extract
     * the `shouldBeExportable` property from the API response and provide for the component
     */
    extractData: (res: any, externalData?: Ref<IItem>) => {
      return {}
    },

    // Export component ~ when not provided, the default export component (`TableExportBtn.vue`) will be used
    exportComponent: undefined as unknown as DefineComponent<any>,

    // Extends the `parseUrlParams` function with project specific logic
    // Please take a look at: ~/libs/App/functions/useTableSpecifics.ts

    // Save the table layout
    // Please take a look at: ~/libs/App/functions/useTableSpecifics.ts

    // Remove table layout
    // Please take a look at: ~/libs/App/functions/useTableSpecifics.ts

    // Get table metadata
    // Please take a look at: ~/libs/App/functions/useTableSpecifics.ts

    // Get custom filter components
    // Please take a look at: ~/libs/App/functions/useTableSpecifics.ts

    // Data fetching
    payloadKey: 'data',
    versionKey: 'data.additionalInformation.lastVersion.id',
    countKey: 'count',
    totalsPayloadKey: 'total',
    columnsKey: 'data.additionalInformation.columnMeta',
    layoutsKey: 'data',
    defaultLayoutKey: 'data.additionalInformation.filtersMeta.data.defaultFilter',
    hashKeys: {
      filters: 'data.additionalInformation.filtersMeta.hash',
      subscriptions: 'data.additionalInformation.subscriptionsMeta.hash',
      columns: 'data.additionalInformation.columnMeta.hash',
    },
  },

  // List
  list: {
    props: {
      noHighlight: true,
      useToBoldLatin: false,
    } as IListProps,
  },

  // Section2
  section2: {
    props: {
      ui: {
        sectionClass: 'rounded-custom bg-truegray-100 dark:bg-truegray-900',
      },
    } as ISectionProps,
  },

  // Selector
  selector: {
    mapKey: 'data',
    countKey: 'count',
    fuseExtendedSearchToken: "'" as ISelectorProps['fuseExtendedSearchToken'],
    shouldFlipOnSearch: true,
    props: {
      hasInfiniteScroll: true,
    } as ISelectorProps,
  },

  // Form
  form: {
    /**
     * Whether to ask for comments when submitting a form
     */
    confirmation: {
      /**
       * When true, the user will be presented with confirmation menu with
       * possibility to add comment when submitting a form
       */
      enabled: json_config.confirmation.enabled,

      /**
       * When true, the user will be required to add a comment when submitting a form
       */
      required: json_config.confirmation.required,

      /**
       * When true, user will be able to change the `enabled` and `required` props in the UI
       */
      editable: json_config.confirmation.editable,

      /**
       * The component to use for the confirmation
       */
      component: defineAsyncComponent(
        () => import('../libs/Shared/components/Form/FormConfirmation.vue'),
      ),
    },

    /**
     * When the form is submitted and no errors are present, this function will be called
     */
    onSubmitSuccess: () => {},
  },

  // Breadcrumbs
  breadcrumbs: {
    homePath: '/',
  },

  // Page wrapper
  pageWrapper: {
    topBar: undefined as unknown as DefineComponent<any>,
    props: {
      ui: {
        titleWithShadow: true,
      },
    } as IPageWrapperProps,
  },

  // Data types
  /**
   * We can extend the data types for the application with our own, and map
   * them to the components we want to use for them
   */
  dataTypes: {
    comparators: {},
    inputs: {},

    // We can also extend some of the predefined categories of data types
    selectorComparators: [],
    nonValueComparators: [],
    booleanishComparators: [],
  } satisfies {
    selectorComparators: ComparatorEnum[]
    nonValueComparators: ComparatorEnum[]
    booleanishComparators: ComparatorEnum[]
    comparators: Partial<Record<ExtendedDataType, ComparatorEnum[]>>
    inputs: Partial<
      Record<
        ExtendedDataType,
        {
          component: any
          props: ComponentProps<any>
          icon: string
        }
      >
    >
  },

  // Logging
  logging: {
    limit: 100,
  },

  // Error handling
  error: {
    handler: (error: any, t: any): string[] => {
      if (error) {
        // Axios
        // When getting explicit messages (in the `data` prop) from BE (should be array), we use them
        if (error.response?.data?.data) {
          return error.response.data.data
        }

        // When getting a single message (string), we use that instead
        if (error.response?.data?.message) {
          return [error.response.data.message]
        }
      }

      return [error.message]
    },
  },

  // Request handling
  request: {
    /**
     * For customizing the data that come from the API
     */
    modifyFnc: undefined,

    /**
     * They path to the data in the response
     */
    payloadKey: 'data',
  },

  // Validation handling
  validation: {
    errorHandler: (error: any): IServerValidationItem[] | undefined => {
      return error?.errors.flatMap((err: any) => err)
    },
  },
}

export type IOperation = {
  id: string
  method: string
  endpoint: string
  date: Datetime
  duration: number
  by?: string
  authorId?: string | number
  payload?: any
  baseUrl?: string
  requestBody?: any
  results: {
    error: number
    success: number
    warning: number
  }
  response?: any

  /**
   * Simple string must be used, it will be translated inside the component
   * -> do NOT use $t() here
   */
  operationName?: string

  /**
   * We can provide custom `entityId` to link the operation to some entity page (like user, product, etc.)
   * in case the response does not not conform to the standard response format
   */
  entityId?: string | number

  /**
   * The entity name -> to eventually link the operation to some entity page (like user, product, etc.)
   */
  entityName?: string

  /**
   * The entity key -> some entities may have other unique identifiers than `id`
   */
  entityKey?: string

  /**
   * Resolved errors
   */
  errors?: string[]

  /**
   * Resolved warnings
   */
  warnings?: string[]
}

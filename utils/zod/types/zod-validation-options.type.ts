export type IZodValidationOptions = {
  /**
   * Whether to watch the data deeply
   *
   * @default true
   */
  deep?: boolean

  /**
   * Validate the data immediately on initialization
   *
   * @default true
   */
  immediate?: boolean

  /**
   * Disable the automatic validation (on value change)
   *
   * @default false
   */
  manual?: boolean

  /**
   * Validation scope
   * Same functionality as vuelidate's $scope
   *
   * @default undefined
   */
  scope?: string | false | null

  /**
   * We can mark the zod instance as watch only, which means most of the functionality
   * inside the `useZod` will be disabled
   *
   * This is useful when we have a zod validation schema in a parent and the
   * child component just accesses the validation
   */
  watchOnly?: boolean
}

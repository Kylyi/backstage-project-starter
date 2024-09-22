import { klona } from 'klona/full'
import { z } from 'zod'

// Types
import type { ZodSchemaObject } from '~/utils/zod/types/zod-schema-object.type'
import type { IZodValidationItem } from '~/utils/zod/types/zod-validation-item.type'
import type { ZodDataObject } from '~/utils/zod/types/zod-data-object.type'
import type { IZodShape } from '~/utils/zod/types/zod-structure.type'
import type { IZodValidationOutput } from '~/utils/zod/types/zod-validation-output'
import type { IZodValidationOptions } from '~/utils/zod/types/zod-validation-options.type'

type IZodInstanceValidationItem = {
  id: string
  componentName?: string
  errors: IZodValidationItem[]
  validateFn: (
    validateNested?: boolean,
    resumeWatch?: boolean
  ) => Promise<boolean>
  resetFn: (shouldPause?: boolean, resetNested?: boolean) => void
}

// We need to get rid of Prisma-specific building keys
const PRISMA_KEYS = [
  'connectOrCreate',
  'create',
  'createMany',
  'update',
  'updateMany',
  'delete',
  'deleteMany',
  'upsert',
  'set',
  'connect',
  'disconnect',
  'where',
]

const PRISMA_KEYS_PREPENDED = PRISMA_KEYS.map(key => `\\.${key}\\b`)
const omitPrismaKeysRegex = new RegExp(PRISMA_KEYS_PREPENDED.join('|'), 'g')

/**
 * Helper that checks if the first passed argument is a zod schema or just options
 */
function checkHasValidation<T extends ZodSchemaObject>(
  schemasOrOptions?: T | IZodValidationOptions,
) {
  const schemaOrOptionsKeys = Object.keys(schemasOrOptions || {})

  // @ts-expect-error ts indexing
  const schemaOrOption = schemasOrOptions?.[schemaOrOptionsKeys[0]]

  return typeof schemaOrOption === 'object' && '_def' in schemaOrOption
}

/**
 * Helper that returns the zod options
 */
function getOptions<T extends ZodSchemaObject>(
  schemasOrOptions?: T | IZodValidationOptions,
  options?: IZodValidationOptions,
  hasValidation?: boolean,
): IZodValidationOptions {
  if (options) {
    return options
  }

  if (!hasValidation) {
    return schemasOrOptions ?? {}
  }

  return {}
}

/**
 * Gets scope name
 */
function getScopeName(scope?: string | false | null) {
  if (scope === false || scope === null) {
    return `__zod${generateUUID()}`
  }

  return scope ? `__zod${scope}` : '__zod'
}

export function useZod<T extends ZodSchemaObject>(
  schemas: T,
  data: ZodDataObject<T>,
  options?: IZodValidationOptions
): IZodValidationOutput<T>

export function useZod<T extends ZodSchemaObject>(
  options?: IZodValidationOptions
): IZodValidationOutput<T>

export function useZod<T extends ZodSchemaObject>(
  schemasOrOptions?: T | IZodValidationOptions,
  data?: ZodDataObject<T>,
  options?: IZodValidationOptions,
): IZodValidationOutput<T> {
  // Utils
  const { locale } = useI18n()
  const componentName = getComponentName(getCurrentInstance())
  const instanceId = generateUUID()
  const hasValidation = checkHasValidation(schemasOrOptions)

  const {
    immediate,
    manual = true,
    deep = true,
    scope,
    watchOnly,
  } = getOptions(schemasOrOptions, options, hasValidation)

  // State
  const isValidated = ref(false)
  const scopedInjectionName = getScopeName(scope)
  const defaultStructure = ref({}) as Ref<IZodShape<T>>
  const $z = ref({}) as Ref<IZodShape<T>>
  const dataReactive = toReactive(data || {})
  const localErrors = ref([]) as Ref<IZodValidationItem[]>

  const requiredFields = inject(
    `${scopedInjectionName}_requiredFields`,
    ref({}) as Ref<IItem>,
  )
  const validations = inject(scopedInjectionName, ref([])) as Ref<
    IZodInstanceValidationItem[]
  >

  provide(scopedInjectionName, validations)
  provide(`${scopedInjectionName}_requiredFields`, requiredFields)

  // REVIEW - This will not account for tree structures
  // For example, if we had multiple components and each with their own children
  // and each child would have a schema, this structure would not be able to
  // account for that
  const nestedValidations = computed(() => {
    const selfIdx = validations.value.findIndex(
      validation => validation.componentName === componentName,
    )

    return validations.value.slice(selfIdx)
  })

  const nestedErrors = computed(() => {
    return nestedValidations.value.flatMap(validation => validation.errors)
  })

  const allErrors = computed(() => {
    return validations.value.flatMap(validation => validation.errors)
  })

  const allErrorsByPath = computed<Record<string, IZodValidationItem[]>>(() => {
    return allErrors.value.reduce((agg, err) => {
      if (!agg[err.$path]) {
        agg[err.$path] = []
      }

      agg[err.$path].push(err)

      return agg
    }, {} as Record<string, IZodValidationItem[]>)
  })

  const allErrorsByCleanPath = computed(() => {
    return Object.entries(allErrorsByPath.value).reduce((agg, [key, value]) => {
      const cleanPath = key.replace(omitPrismaKeysRegex, '')
      agg[cleanPath] = value

      return agg
    }, {} as Record<string, IZodValidationItem[]>)
  })

  // ANCHOR: Validation function
  async function validate(validateNested = true, resumeWatch = true) {
    if (validateNested) {
      await Promise.all(
        nestedValidations.value
          .slice(1)
          .map(validation => validation.validateFn(false, resumeWatch)),
      )
    }

    const schemas = schemasOrOptions as T

    // Reset error structure & local errors
    const $zTemp: IZodShape<T> = {} as IZodShape<T>
    localErrors.value = []

    // When just options were passed, we return an empty object
    if (!hasValidation) {
      return nestedErrors.value.length === 0
    }

    for (const key in schemas) {
      if (key in schemas) {
        try {
          await schemas[key].parseAsync(toValue(data?.[key]))
        } catch (error: any) {
          const zodIssues = error.issues.map((issue: z.ZodIssue) => {
            issue.path = [key, ...issue.path]

            return issue
          }) as z.ZodIssue[]

          // Populate the error structure
          zodIssues.forEach(issue => {
            const $path = issue.path.join('.')
            const $id = generateUUID()

            const existingValidation = get($zTemp, $path, {
              $errors: [],
              $messages: [],
              $path,
              $id,
            }) as IZodValidationItem

            existingValidation.$errors.push(issue)
            existingValidation.$messages.push(issue.message)
            existingValidation.$required = !!get(defaultStructure.value, $path)
              ?.$required

            // Populate the local errors
            localErrors.value.push(existingValidation)

            // Set the error in the error structure
            set($zTemp, $path, existingValidation)
          })
        }
      }
    }

    // Set the error structure
    $z.value = merge(klona(defaultStructure.value), $zTemp)

    // Extend the global validations
    const existingValidationIdx = validations.value.findIndex(
      validation => validation.id === instanceId,
    )

    // When validations of this instance already exist, we replace them
    if (existingValidationIdx !== -1) {
      validations.value.splice(existingValidationIdx, 1, {
        id: instanceId,
        componentName,
        errors: localErrors.value,
        validateFn: validate,
        resetFn: reset,
      })
    }

    // Otherwise we just push them
    else {
      validations.value.push({
        id: instanceId,
        componentName,
        errors: localErrors.value,
        validateFn: validate,
        resetFn: reset,
      })
    }

    // Conditionally resume the watch
    if (resumeWatch) {
      resume()
    }

    isValidated.value = true

    return nestedErrors.value.length === 0
  }

  function createEmptyErrorStructureFromShape(
    shape: z.ZodRawShape,
    path: string,
  ): any {
    const structure = {} as IZodShape<typeof shape>

    for (const key in shape) {
      if (key in shape) {
        const schemaValue = shape[key]

        if (schemaValue instanceof z.ZodObject) {
          const isRequired = !schemaValue.isOptional()

          structure[key] = {
            $id: generateUUID(),
            $errors: [],
            $messages: [],
            $path: key,
            $required: isRequired,
            ...createEmptyErrorStructureFromShape(
              schemaValue.shape,
              `${path}.${key}`,
            ),
          }

          // Set the requirement for the field
          const cleanPath = `${path}.${key}`.replace(omitPrismaKeysRegex, '')
          requiredFields.value[cleanPath] = isRequired
        } else if (schemaValue instanceof z.ZodArray) {
          // @ts-expect-error Empty array is fine
          structure[key] = []
        } else {
          const isRequired = !schemaValue.isOptional()

          structure[key] = {
            $id: generateUUID(),
            $errors: [],
            $messages: [],
            $path: key,
            $required: isRequired,
          }

          // Set the requirement for the field
          const cleanPath = `${path}.${key}`.replace(omitPrismaKeysRegex, '')
          requiredFields.value[cleanPath] = isRequired
        }
      }
    }

    return structure
  }

  function createEmptyErrorStructure() {
    const structure = {} as IZodShape<T>
    const schemas = schemasOrOptions as T

    // When just options were passed, we return an empty object
    if (!hasValidation) {
      return structure
    }

    for (const key in schemas) {
      if (key in schemas) {
        const schemaValue = schemas[key]

        if (schemaValue instanceof z.ZodObject) {
          const isRequired = !schemaValue.isOptional()

          structure[key] = {
            $errors: [],
            $messages: [],
            $path: key,
            $required: isRequired,
            ...createEmptyErrorStructureFromShape(schemaValue.shape, key),
          }

          // Set the requirement for the field
          const cleanPath = key.replace(omitPrismaKeysRegex, '')
          requiredFields.value[cleanPath] = isRequired
        } else if (schemaValue instanceof z.ZodArray) {
          // @ts-expect-error Empy array is valid for array...
          structure[key] = []
        } else {
          const isRequired = !schemaValue.isOptional()

          // @ts-expect-error idk
          structure[key] = {
            $errors: [],
            $messages: [],
            $path: key,
            $required: isRequired,
          }

          // Set the requirement for the field
          const cleanPath = key.replace(omitPrismaKeysRegex, '')
          requiredFields.value[cleanPath] = isRequired
        }
      }
    }

    return structure
  }

  function reset(shouldPause = true, resetNested = true) {
    defaultStructure.value = createEmptyErrorStructure()
    $z.value = klona(defaultStructure.value)
    isValidated.value = false

    if (shouldPause) {
      pause()
    }

    if (resetNested) {
      nestedValidations.value.forEach(validation =>
        validation.resetFn(shouldPause, false),
      )
    }
  }

  const debouncedValidate = useThrottleFn(
    () => validate(false),
    150, // Throttle ms
    true, // Trailing
    false, // Leading
  )
  const { pause, resume } = watchPausable(dataReactive, debouncedValidate, {
    deep,
    immediate,
  })

  // We watch the locale and localize the errors when it changes
  watch(locale, () => validate(false, true))

  // Lifecycle
  onUnmounted(() => {
    validations.value = validations.value.filter(
      validation => validation.id !== instanceId,
    )
  })

  // Initialize
  if (!watchOnly) {
    defaultStructure.value = createEmptyErrorStructure()
    $z.value = klona(defaultStructure.value)
  }

  if (manual) {
    pause()
  }

  if (!immediate && !watchOnly) {
    validations.value = [
      ...validations.value,
      {
        id: instanceId,
        componentName,
        errors: [],
        validateFn: validate,
        resetFn: reset,
      },
    ]
  }

  function getValidationForField(field: string) {
    return allErrorsByCleanPath.value[field]
  }

  function isFieldRequired(field: string) {
    return !!requiredFields.value[field]
  }

  return computed(() => ({
    ...$z.value,
    $allErrors: allErrors.value,
    $allErrorsByPath: allErrorsByPath.value,
    $errors: nestedErrors.value,
    $validate: validate,
    $createEmptyErrorStructure: createEmptyErrorStructure,
    $reset: reset,
    $getValidationForField: getValidationForField,
    $isFieldRequired: isFieldRequired,
  }))
}

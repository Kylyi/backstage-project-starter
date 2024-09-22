// Types
import type { ZodSchemaObject } from '~/utils/zod/types/zod-schema-object.type'
import type { IZodShape } from '~/utils/zod/types/zod-structure.type'
import type { IZodValidationItem } from '~/utils/zod/types/zod-validation-item.type'

export type IZodValidationOutput<T extends ZodSchemaObject> = ComputedRef<
  IZodShape<T> & {
    $errors: IZodValidationItem[]
    $allErrors: IZodValidationItem[]
    $allErrorsByPath: Record<string, IZodValidationItem[]>
    $validate: (
      validateNested?: boolean,
      resumeWatch?: boolean
    ) => Promise<boolean>
    $createEmptyErrorStructure: () => IZodShape<T>
    $reset: (shouldPause?: boolean) => void
    $getValidationForField: (
      field: string
    ) => IZodValidationItem | Array<IZodValidationItem | undefined> | undefined
    $isFieldRequired: (field: string) => boolean
  }
>

// Types
import type { ZodInferred } from '~/utils/zod/types/zod-inferred.type'
import type { ZodSchemaObject } from '~/utils/zod/types/zod-schema-object.type'

export type ZodDataObject<T extends ZodSchemaObject> = {
  [P in keyof T]: ZodInferred<T[P]>
}

import type { z } from 'zod'

export type ZodInferred<T extends z.ZodSchema<any, any>> = MaybeRefOrGetter<
  z.infer<T>
>

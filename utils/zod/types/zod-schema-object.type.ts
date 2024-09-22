import type { z } from 'zod'

export type ZodSchemaObject = Record<string, z.ZodType<any, any, any>>

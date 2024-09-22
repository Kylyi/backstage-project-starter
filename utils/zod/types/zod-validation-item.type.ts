import type { z } from 'zod'

export type IZodValidationItem = {
  $id: string
  $errors: z.ZodIssue[]
  $messages: string[]
  $path: string
  $required: boolean
}

import { createAvatar } from '@dicebear/core'
import { botttsNeutral } from '@dicebear/collection'

export function generateAvatar(seed: string) {
  return createAvatar(botttsNeutral, {
    seed,
    radius: 16,
  })
}

import type { Middleware } from '@floating-ui/dom'

export const cover: Middleware = {
  name: 'cover',
  fn: ({ y, rects, placement }) => {
    const modifier = placement.startsWith('bottom') ? -1 : 1
    const { height: referenceHeight } = rects.reference
    const { height: menuHeight } = rects.floating

    return {
      y: Math.max(y + modifier * (menuHeight / 2) - referenceHeight, 0),
    }
  },
}

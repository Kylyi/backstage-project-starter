import type { Middleware } from '@floating-ui/dom'

export const matchWidth: Middleware = {
  name: 'matchWidth',
  fn: ({ elements, rects }) => {
    const width = rects.reference.width
    const floatingElStyle = getComputedStyle(elements.floating)
    const marginLeft = floatingElStyle.marginLeft
    const marginRight = floatingElStyle.marginRight

    elements.floating.style.width = `calc(${width}px - ${marginLeft} - ${marginRight})`
    elements.floating.style.maxWidth = `calc(${width}px - ${marginLeft} - ${marginRight})`

    return {
      x: rects.reference.x,
    }
  },
}

import type { Directive } from 'vue'

function getRippleAttributes(ev: MouseEvent) {
  const target = ev.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = ev.clientX - rect.left
  const y = ev.clientY - rect.top
  const borderWidth = getComputedStyle(target).getPropertyValue('border-width')

  return {
    x,
    y,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    ...(borderWidth && { top: `-${borderWidth}`, left: `-${borderWidth}` }),
  }
}

export const vRipple: Directive = {
  mounted(el, { value }) {
    if (value === false) {
      return
    }

    ;(el as HTMLElement).addEventListener('click', ev => {
      const rippleContainerEl = document.createElement('span')
      const rippleEl = document.createElement('span')
      const rippleAttributes = getRippleAttributes(ev)

      // Handle bordered elements
      rippleContainerEl.style.width = rippleAttributes.width
      rippleContainerEl.style.height = rippleAttributes.height
      rippleContainerEl.style.top = rippleAttributes.top || '0'
      rippleContainerEl.style.left = rippleAttributes.left || '0'

      rippleEl.style.top = `${rippleAttributes.y}px`
      rippleEl.style.left = `${rippleAttributes.x}px`

      rippleContainerEl.classList.add('ripple-container')
      rippleEl.classList.add('ripple')

      rippleContainerEl.appendChild(rippleEl)

      rippleEl.addEventListener('animationend', () => {
        rippleContainerEl.remove()
      })

      el.appendChild(rippleContainerEl)
    })
  },
}

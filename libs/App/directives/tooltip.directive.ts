import { type App, type Directive, createApp } from 'vue'
import type { Placement } from '@floating-ui/dom'

// COMPONENTS
import Menu from '~/components/Menu/Menu.vue'

function createTooltip(ev: Event, label: () => string, placement?: Placement) {
  const el = ev.target as HTMLElement

  const app = createApp(Menu, {
    modelValue: true,
    label: label(),
    placement,
    hideHeader: true,
    referenceTarget: el,
  })

  const divPlaceholder = document.createElement('div')
  app.mount(divPlaceholder)

  return { app, divPlaceholder }
}

export const vTooltip: Directive = {
  mounted(el, { value }) {
    if (value === false) {
      return
    }

    const label = value.label as () => string
    const placement = value.placement as Placement
    let tooltip: { app: App<Element>, divPlaceholder: HTMLDivElement } | null
      = null

    el.addEventListener('mouseenter', (ev: any) => {
      tooltip = createTooltip(ev, label, placement)
      el.appendChild(tooltip.divPlaceholder)
    })

    el.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.app.unmount()
        el.removeChild(tooltip.divPlaceholder)
        tooltip = null
      }
    })
  },
}

<script setup lang="ts">
import { klona } from 'klona'
import type { Required } from 'utility-types'
import { config } from '~/components/config/components-config'

// Types
import type { INavigationLink } from '~/libs/App/types/navigation-link.type'

// Store
import { useAppStore } from '~/libs/App/app.store'

// Components
import SearchInput from '~/components/Inputs/SearchInput.vue'

type IProps = {
  mini?: boolean
  noSearch?: boolean
  sections: INavigationLink[]
}

const props = defineProps<IProps>()

// Utils
const route = useRoute()
const { isMobile } = useMobile()
const { normalizeText } = useText()

// Store
const { lastPointerDownEvent } = storeToRefs(useAppStore())

// Layout
const navigationLinksEl = ref<HTMLDivElement>()
const searchEl = ref<ComponentInstance<typeof SearchInput>>()
const { elementX, elementWidth } = useMouseInElement(navigationLinksEl)
const leftDrawer = inject<Ref<boolean>>('leftDrawer', ref(true))
const isMini = defineModel<boolean>('mini')
const expandedById = ref<IItem>({})
const sections = toRef(props, 'sections')
const state = ref({ mini: props.mini, drawer: leftDrawer.value })

const isOutside = computed(() => {
  if (!elementX.value || !elementWidth.value) {
    return false
  }

  return elementX.value - elementWidth.value > 80
})

// Searching
const search = ref('')

const searchExtended = computed(() => {
  if (!search.value) {
    return ''
  }

  const useToBoldLatin = config.list.props.useToBoldLatin
  const transformedSearch = useToBoldLatin
    ? $toBoldLatin(search.value)
    : normalizeText(search.value)

  return transformedSearch
})

const sectionsWithSearchKey = computed(() => {
  const useToBoldLatin = config.list.props.useToBoldLatin
  function boldLatin(text: string) {
    return $toBoldLatin(text).toLowerCase()
  }

  const textFnc = useToBoldLatin ? boldLatin : normalizeText

  return sections.value.map(section => {
    section.children = section.children?.map(child => ({
      ...child,
      __search: textFnc(`${child.label}`),
    }))

    const search = textFnc(`${section.label}`)

    return {
      ...section,
      __search: search,
    }
  })
})

const sectionsFiltered = computed<INavigationLink[]>(() => {
  if (!search.value) {
    return sections.value
  }

  const sectionsClone = klona(sectionsWithSearchKey.value)

  return sectionsClone.filter(item => {
    const hasChildren = !!item.children

    if (!hasChildren) {
      return item.__search.includes(searchExtended.value)
    } else {
      const filteredChildren = item.children!.filter(child =>
        // @ts-expect-error TS doesn't know about __search
        child.__search.includes(searchExtended.value),
      )

      item.children = filteredChildren

      return !!item.children.length
    }
  })
})

const sectionsFilteredFlat = computed(() => {
  return sectionsFiltered.value.reduce<INavigationLink[]>((agg, section) => {
    if (section.children) {
      return [...agg, section, ...section.children]
    }

    return [...agg, section]
  }, [])
})

function isAscendantPath(path?: INavigationLink['to']): boolean {
  if (!path) {
    return false
  }

  const currentPathLocalized = $p(route.path)
  const _path = typeof path === 'string' ? path : (path as any).path

  if (_path === $p('/')) {
    return route.path === path
  }

  return (
    currentPathLocalized === _path
    || currentPathLocalized.startsWith(`${_path}/`)
  )
}

function isActiveLinkInSection(section: INavigationLink) {
  if (section.children) {
    return section.children.some(child => isAscendantPath(child.to))
  }

  return isAscendantPath(section.to)
}

function saveCurrentState() {
  nextTick(() => {
    state.value = { mini: !!isMini.value, drawer: leftDrawer.value }
    selectedId.value = undefined
  })
}

/**
 * Used for touch devices - we give it some timeout to not lag the animation
 */
function delayedCollapse() {
  setTimeout(() => {
    expandedById.value = {}
  }, 500)
}

function getLinkClass(section: INavigationLink) {
  return {
    'is-active': section.isActive
      ? section.isActive()
      : isActiveLinkInSection(section),
    'is-selected': selectedId.value === section.id,
  }
}

// Keyboard navigation
const selectedId = ref<string>()

function handleKeyDown(e: Required<Partial<KeyboardEvent>, 'key'>) {
  if (e.key === 'Escape') {
    search.value = ''
    selectedId.value = undefined
    isMini.value = state.value.mini
    leftDrawer.value = state.value.drawer
  }

  // Move down
  if (e.key === 'ArrowDown') {
    const sectionIdx
      = sectionsFilteredFlat.value.findIndex(
        section => section.id === selectedId.value,
      ) + 1

    const section = sectionsFilteredFlat.value[sectionIdx]
    const hasChildren = !!section?.children
    const isExpanded = expandedById.value[section?.id]

    if (!isExpanded && hasChildren) {
      expandedById.value = { ...expandedById.value, [section.id]: true }
    }

    e.preventDefault?.()

    if (hasChildren) {
      selectedId.value = section.children?.[0].id
    } else if (sectionIdx < sectionsFilteredFlat.value.length) {
      selectedId.value = sectionsFilteredFlat.value[sectionIdx].id
    }
  }

  // Move up
  if (e.key === 'ArrowUp') {
    let sectionIdx
      = sectionsFilteredFlat.value.findIndex(
        section => section.id === selectedId.value,
      ) - 1

    const section = sectionsFilteredFlat.value[sectionIdx]
    const hasChildren = !!section?.children

    if (hasChildren) {
      sectionIdx--
    }

    e.preventDefault?.()

    selectedId.value = sectionsFilteredFlat.value[sectionIdx]?.id
  }

  // Enter
  if (e.key === 'Enter') {
    const section = sectionsFilteredFlat.value.find(
      section => section.id === selectedId.value,
    )

    if (section?.to) {
      search.value = ''
      searchEl.value?.blur()

      isMini.value = state.value.mini
      leftDrawer.value = state.value.drawer

      if (!leftDrawer.value || state.value.mini) {
        expandedById.value = {}
      }

      $nav(section.to)
    }
  }
}

// When in mini mode and we move outside of the navigation, we collapse it
whenever(isOutside, () => {
  if (props.mini) {
    expandedById.value = {}
  }
})

// When we change the route, we collapse the navigation
watch(
  () => route.name,
  () => {
    if (lastPointerDownEvent.value?.pointerType === 'touch') {
      delayedCollapse()
    }
  },
)

// Expand the filtered sections
// Collapse when search is empty
watchDebounced(sectionsFiltered, sectionsFiltered => {
  if (sectionsFiltered.length === sections.value.length) {
    return
  }

  const ids = sectionsFiltered.map(section => section.id)
  expandedById.value = ids.reduce((agg, id) => ({ ...agg, [id]: true }), {})

  if (sectionsFiltered.length) {
    selectedId.value = undefined
    handleKeyDown({ key: 'ArrowDown' })
  }
})

// When we switch from mini to full, we want to expand the active section
watch(
  () => props.mini,
  isMini => {
    if (!isMini && !isMobile.value) {
      const activeSection = sectionsFiltered.value.find(section => {
        if (!section.children) {
          return false
        }

        return section.isActive
          ? section.isActive()
          : isActiveLinkInSection(section)
      })

      expandedById.value = {
        ...(activeSection && { [activeSection.id]: true }),
      }
    }

    // When we switch to full, we focus the search input
    if (!isMini) {
      nextTick(() => searchEl.value?.focus())
    }

    // When we switch to mini, we reset the selection and search
    else {
      search.value = ''
      selectedId.value = undefined
    }

    // When we switch to mini and we are outside of the navigation, we collapse it
    if (isMini && isOutside.value) {
      expandedById.value = {}
    }
  },
  { immediate: true },
)

if (!props.noSearch) {
  onKeyStroke(['k', 'K'], ev => {
    const isControlKey = ev.ctrlKey || ev.metaKey

    if (isControlKey) {
      saveCurrentState()
      ev.preventDefault()
      ev.stopPropagation()

      nextTick(() => {
        leftDrawer.value = true

        if (props.mini) {
          isMini.value = false
          search.value = ''
        }

        searchEl.value?.select()
      })
    }
  })
}
</script>

<template>
  <div
    ref="navigationLinksEl"
    class="navigation-links"
  >
    <SearchInput
      v-if="!mini && !props.noSearch"
      ref="searchEl"
      v-model="search"
      :input-props="{ onKeydown: handleKeyDown }"
    >
      <template #append>
        <KeyboardShortcut
          with-ctrl
          char="K"
        />
      </template>
    </SearchInput>

    <Separator v-if="!mini" />

    <template
      v-for="section in sectionsFiltered"
      :key="section.label"
    >
      <Collapse
        v-if="section.children"
        v-model="expandedById[section.id]"
        :padded="false"
        no-separator
        :header-class="[
          '!min-h-9 !p-l-2 !p-r-1 pointer-events-auto',
          getLinkClass(section),
          { 'is-mini w-14 flex-center': mini },
        ]"
        content-class="flex flex-col"
      >
        <template #header>
          <Tooltip
            v-if="mini"
            :title="section.label"
            :offset="8"
            placement="right"
          >
            {{ section.label }}
          </Tooltip>

          <div
            flex="~ grow gap-4"
            w-fit
          >
            <!-- Icon -->
            <div flex="~ center shrink-0 self-start">
              <div
                class="h-6 w-6"
                :class="[section.icon]"
              />
            </div>

            <span
              v-if="!mini"
              data-cy="nav-link-with-children"
            >
              {{ section.label }}
            </span>
          </div>
        </template>

        <template #expand-icon>
          <div
            class="i-majesticons:chevron-right shrink-0"
            transition="duration-150"
            :class="{ 'rotate-90': !!expandedById[section.id] }"
          />
        </template>

        <div
          class="navigation-links__inner"
          :class="{ 'rounded-t-custom rounded-tl-0': mini }"
        >
          <NuxtLink
            v-for="childLink in section.children"
            :key="childLink.label"
            :to="childLink.to"
            class="nested"
            :class="[getLinkClass(childLink)]"
            flex="~ gap-1 items-start"
          >
            <div class="i-line-md:chevron-small-right m-t-0.5 h-5 w-5 shrink-0" />
            <span select-none>
              {{ childLink.label }}
            </span>
          </NuxtLink>
        </div>
      </Collapse>

      <!-- Link with no children -->
      <NuxtLink
        v-else
        :to="section.to"
        pointer-events="auto"
        p="l-2 r-1 y-1"
        bg="$Collapse-header-bg"
        flex="~ gap-4 items-center"
        min-h="9"
        :class="[getLinkClass(section), { 'w-14 flex-center': mini }]"
        @click="section.onClick"
      >
        <Tooltip
          v-if="mini"
          :title="section.label"
          :offset="8"
          placement="right"
        >
          {{ section.label }}
        </Tooltip>

        <!-- Icon -->
        <div
          class="h-6 w-6 shrink-0"
          :class="[section.icon]"
          self-start
          m="t-0.5"
        />

        <!-- Label -->
        <span
          v-if="!mini"
          align-middle
          select-none
        >
          {{ section.label }}
        </span>
      </NuxtLink>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.navigation-links {
  @apply flex flex-col gap-2;

  a {
    @apply relative p-x-2 rounded-custom;

    &.is-active {
      @apply font-semibold bg-primary color-white;
    }

    &:hover {
      @apply bg-primary/80 dark:bg-primary/50 color-white;
    }
  }

  &__inner {
    @apply relative flex flex-col p-x-1 bg-$Collapse-header-bg gap-1.5
      p-t-2 p-b-3 m-b-2 pointer-events-auto;
  }
}

:deep(.header) {
  &.is-active {
    @apply dark:bg-darker bg-dark color-white;
  }

  &.is-mini {
    @apply gap-0;
  }

  &:hover {
    @apply dark:bg-darker bg-dark-200 color-white;
  }
}
</style>

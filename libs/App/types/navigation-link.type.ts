export type INavigationLink = {
  id: string
  icon?: string
  label: string
  to?: any
  children?: INavigationLink[]
  onClick?: () => void
  isActive?: () => boolean
}

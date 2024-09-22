export type IAppState = {
  general?: {
    keyboardShortcuts?: boolean
  }
  form: {
    confirmation: {
      enabled?: boolean
      required?: boolean
    }
  }
  table?: {
    autoSaveSchema?: boolean
    fit?: 'auto' | 'content' | 'stretch' | null
  }
}

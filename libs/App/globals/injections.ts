// Models
import type { FileModel } from '~/components/FileInput/models/file.model'

export function injectStrict<T>(key: InjectionKey<T>, fallback?: T) {
  const resolved = inject(key, fallback)

  if (!resolved) {
    throw new Error(`Could not resolve ${key.description}`)
  }

  return resolved
}

// Files
export const filesKey: InjectionKey<
  Ref<{ [COMPONENT_ID: string]: Array<FileModel | IFile> }>
> = Symbol('files')

// Operations
export const operationNameKey: InjectionKey<MaybeRefOrGetter<string>> = Symbol('operationName')
export const operationEntityIdKey: InjectionKey<MaybeRefOrGetter<string>> = Symbol('operationEntityId')

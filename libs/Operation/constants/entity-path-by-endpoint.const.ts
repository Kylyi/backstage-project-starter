export const ENTITY_PATH_BY_ENDPOINT: Record<
  string,
  (id: string | number) => string
> = {
  //
}

export function matchEntityPathByEndpoint(endpoint: string) {
  const ENTITY_PATH_BY_ENDPOINT_KEYS = Object.keys(ENTITY_PATH_BY_ENDPOINT)

  const matchedKey = ENTITY_PATH_BY_ENDPOINT_KEYS.find(key =>
    endpoint.startsWith(key),
  )

  return matchedKey ? ENTITY_PATH_BY_ENDPOINT[matchedKey] : null
}

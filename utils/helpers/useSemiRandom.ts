export function useSemiRandom() {
  function hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash |= 0 // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  function semiRandomPick<T>(array: T[], str: string): T {
    const hashValue = hashString(str)
    const index = hashValue % array.length
    return array[index]
  }

  return { semiRandomPick }
}

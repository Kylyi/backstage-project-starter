export function stringToFloat(str: string) {
  const stringToFloatRegex = /[-+]?\d+(?:.\d+)?/

  return stringToFloatRegex.exec(str)?.[0]
}

const regex
  = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/

const without_regex
  = /^([0-9A-Za-z-\.@:%_+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/

export function isUrl(value: string): boolean {
  const isUrlWithProtocol = regex.test(value)
  const isUrlWithoutProtocol = without_regex.test(value)

  return isUrlWithProtocol || isUrlWithoutProtocol
}

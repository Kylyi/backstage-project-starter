export function useText() {
  const normalizeText = (
    txt: string,
    options?: {
      lowerCase?: boolean
      removeConsecutiveSpaces?: boolean
    },
  ) => {
    let normalizedText = ''
    const { lowerCase = true } = options || {}

    if (typeof txt !== 'string') {
      return txt
    }

    if (lowerCase) {
      normalizedText = txt
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036F]/g, '') // Normalize text to remove diacritics (accents) and other special characters
        .replace(/[^a-zA-Z0-9\s]/g, '') // Replace any remaining non-alphanumeric characters (excluding spaces) with empty strings
    } else {
      normalizedText = txt
        .normalize('NFKD')
        .replace(/[\u0300-\u036F]/g, '') // Normalize text to remove diacritics (accents) and other special characters
        .replace(/[^a-zA-Z0-9\s]/g, '') // Replace any remaining non-alphanumeric characters (excluding spaces) with empty strings
    }

    if (options?.removeConsecutiveSpaces) {
      return normalizedText.replace(/\s+/g, ' ')
    }

    return normalizedText
  }

  const createShortcut = (text: string, maxLength = 5) => {
    if (text.length <= 1) {
      return text
    }

    if (!text.includes(' ')) {
      return `${text[0]}${text[text.length - 1]}`
    }

    return text
      .split(' ')
      .map(s => s[0])
      .join('')
      .toUpperCase()
      .slice(0, maxLength)
  }

  const capitalize = (text: string, firstOnly = false, splitChar = ' ') => {
    let splitText = text.split(splitChar)

    splitText = splitText.slice(0, firstOnly ? 1 : undefined).map(t => {
      return t[0].toUpperCase() + t.slice(1)
    })

    return splitText.join(splitChar)
  }

  return { normalizeText, createShortcut, capitalize }
}

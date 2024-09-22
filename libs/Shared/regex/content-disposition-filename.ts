export function getFilenameFromContentDisposition(contentDisposition: string) {
  // First, try to match the filename* version (which can include characters outside of ASCII)
  const filenameStarRegex = /filename\*\s*=\s*(?:UTF-8''|\w+'+\w+'?)([^;]*)/i
  const matchFilenameStar = contentDisposition.match(filenameStarRegex)
  if (matchFilenameStar && matchFilenameStar[1]) {
    // Decode URI component and return
    return decodeURIComponent(matchFilenameStar[1])
  }

  // If filename* wasn't present or valid, try to match the regular filename version
  const filenameRegex = /filename\s*=\s*["']?([^"';]*)["']?/i
  const matchFilename = contentDisposition.match(filenameRegex)
  if (matchFilename && matchFilename[1]) {
    return matchFilename[1]
  }

  // If neither pattern matched, return null to indicate no filename was found
  return '...'
}

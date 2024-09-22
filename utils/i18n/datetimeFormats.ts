export const datetimeFormats: Record<string, Intl.DateTimeFormatOptions> = {
  default: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  },
  short: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  },
  monthShort: {
    month: 'short',
    timeZone: 'UTC',
  },
  month: {
    month: 'long',
    timeZone: 'UTC',
  },
  year: {
    year: 'numeric',
    timeZone: 'UTC',
  },
  yearMonth: {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  },
  dayShort: {
    weekday: 'short',
    timeZone: 'UTC',
  },
  day: {
    weekday: 'long',
    timeZone: 'UTC',
  },
  time: {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  },
  long: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  },
  shortLong: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  },
  shortLongWithSeconds: {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
  },
  timestamp: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
}

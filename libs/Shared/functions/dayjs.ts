import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import isBetween from 'dayjs/plugin/isBetween.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import isoWeek from 'dayjs/plugin/isoWeek.js'
import dayOfYear from 'dayjs/plugin/dayOfYear.js'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import quarterOfYear from 'dayjs/plugin/quarterOfYear.js'
import 'dayjs/locale/en-gb.js'
import 'dayjs/locale/sr'
import type { Datetime } from '~/libs/Shared/types/datetime.type'

// Ignore the warnings (eslint-plugin-import) - when used as the warning suggests, it breaks!
dayjs.extend(duration)
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(isoWeek)
dayjs.extend(dayOfYear)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(quarterOfYear)

export function $date(
  date?: Datetime,
  format?: dayjs.OptionType,
  strict?: boolean,
) {
  let isUtc = true

  if (typeof format === 'object' && 'utc' in format) {
    isUtc = format.utc ?? true
  }

  if (isUtc) {
    // @ts-expect-error - dayjs.utc() is not typed
    return dayjs.utc(date ?? undefined, format, strict)
  }

  return dayjs(date ?? undefined, format, strict)
}
export const $duration = dayjs.duration

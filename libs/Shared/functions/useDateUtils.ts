import type dayjs from 'dayjs'
import { datetimeFormats } from '~/utils/i18n'

// Models
import { Day } from '~/libs/Shared/models/day.model'
import { DayEnum } from '~/components/Inputs/DateInput/enums/day.enum'

export type Period = {
  periodStart: dayjs.Dayjs
  periodEnd: dayjs.Dayjs
}

export type IExtendedPeriodOptions = {
  unit?: dayjs.OpUnitType | dayjs.ManipulateType | 'isoWeek'
  firstDayOfWeek?: DayEnum
  minCountOfWeeks?: number
  periodRef?: MaybeRefOrGetter<Period>
  dateRef?: MaybeRefOrGetter<Datetime>
}

export type IDateOptions = {
  localeIso?: string
  isLocalString?: boolean
  outputIntlOptions?: Intl.DateTimeFormatOptions | DateFormatPreset
  format?: string
}

export type DateFormatPreset = keyof typeof datetimeFormats

/**
 * Works the same way as `.valueOf()` but ignores the time part of the date
 */
export function getDateSimpleValue(dateRef: MaybeRefOrGetter<Datetime>) {
  const date = toValue(dateRef)

  return $date(date).startOf('day').valueOf()
}

export function useDateUtils() {
  const { currentLocaleIso, getLocaleDateFormat } = useLocale()

  const localeUses24HourTime = () => {
    return (
      new Intl.DateTimeFormat(currentLocaleIso.value, { hour: 'numeric' })
        .formatToParts(new Date(2020, 0, 1, 13))
        .find(part => part.type === 'hour')?.value.length === 2
    )
  }

  const formatDate = (
    dateRef?: MaybeRefOrGetter<Datetime>,
    options: IDateOptions | DateFormatPreset = 'short',
  ) => {
    let date = toValue(dateRef)

    if (typeof date === 'string') {
      date = date.trim()
    }

    // When using a predefined format, we use the corresponding Intl API
    if (typeof options === 'string') {
      const parsedDate = parseDate(date)

      if (!parsedDate.isValid()) {
        return ''
      }

      const usedLocale = currentLocaleIso.value
      const isPredefinedFormat = datetimeFormats[options]

      if (isPredefinedFormat) {
        return Intl.DateTimeFormat(usedLocale, datetimeFormats[options])
          .format(parsedDate.valueOf())
          .replace(/(\d{2})\.\s(\d{2})\.\s(\d{4})/g, '$1.$2.$3')
      } else {
        return parsedDate
          .format(options)
          .replace(/(\d{2})\.\s(\d{2})\.\s(\d{4})/g, '$1.$2.$3')
      }
    }

    // Otherwise we use the Intl API
    else {
      const { localeIso, outputIntlOptions } = options
      const usedLocale = localeIso || currentLocaleIso.value
      const parsedDate = parseDate(date, options)

      if (!parsedDate.isValid()) {
        return ''
      }

      // When using a predefined format, we use the corresponding Intl API
      if (
        typeof outputIntlOptions === 'string'
        && datetimeFormats[outputIntlOptions]
      ) {
        return Intl.DateTimeFormat(
          usedLocale,
          datetimeFormats[outputIntlOptions],
        )
          .format(parsedDate.valueOf())
          .replace(/ /gi, '')
      }

      // When using an explicit format, we use the dayjs API
      else if (typeof outputIntlOptions === 'string') {
        return parsedDate.format(outputIntlOptions)
      }

      return Intl.DateTimeFormat(usedLocale, outputIntlOptions)
        .format(parsedDate.valueOf())
        .replace(/ /gi, '')
    }
  }

  const formatTime = (
    timeRef: MaybeRefOrGetter<string>,
    options: {
      appendString?: string
    } = {},
  ) => {
    const { appendString = '' } = options

    return formatDate(`2020-01-01 ${toValue(timeRef)} ${appendString}`, {
      outputIntlOptions: 'time',
    })
  }

  const parseDate = (
    dateRef: MaybeRefOrGetter<Datetime>,
    options?: IDateOptions,
  ) => {
    const { isLocalString, localeIso } = options || {}
    const usedLocale = localeIso || currentLocaleIso.value

    return isLocalString
      ? $date(toValue(dateRef), getLocaleDateFormat(usedLocale))
      : $date(toValue(dateRef))
  }

  const getPeriod = ({
    dateRef = undefined,
    periodRef = undefined,
    firstDayOfWeek = DayEnum.MONDAY,
    unit = 'isoWeek' as dayjs.ManipulateType,
  }: IExtendedPeriodOptions = {}): Period => {
    const period = toValue(periodRef)
    let periodStart = toValue(period?.periodStart || dateRef)
    periodStart = $date(periodStart).startOf(unit)

    if (unit === 'isoWeek' || unit.startsWith('w')) {
      const firstDayOfWeekIdx
        = periodStart.day() < firstDayOfWeek ? firstDayOfWeek - 7 : firstDayOfWeek
      periodStart = periodStart.day(firstDayOfWeekIdx)
    }

    return {
      periodStart,
      periodEnd: periodStart.add(1, unit as dayjs.ManipulateType).subtract(1),
    }
  }

  const getExtendedPeriod = ({
    dateRef = undefined,
    periodRef = undefined,
    firstDayOfWeek = DayEnum.MONDAY,
    minCountOfWeeks = 0,
    unit = 'isoWeek',
  }: IExtendedPeriodOptions = {}): Period => {
    const period = toValue(periodRef)
    let periodStart = toValue(period?.periodStart || dateRef)
    let periodEnd = toValue(period?.periodEnd || dateRef)

    periodStart = $date(periodStart).startOf(unit)
    periodEnd = $date(periodEnd).endOf(unit)

    const periodStartExtendedDayIdx
      = periodStart.day() < firstDayOfWeek ? firstDayOfWeek - 7 : firstDayOfWeek
    const periodStartExtended = periodStart.day(periodStartExtendedDayIdx)
    let periodEndExtended = periodEnd.day() ? periodEnd.day(7) : periodEnd
    const diff = periodEndExtended.diff(periodStartExtended, 'day')

    minCountOfWeeks = Math.max(minCountOfWeeks, Math.ceil(diff / 7))
    periodEndExtended = periodEndExtended.add(
      minCountOfWeeks * 7 - 1 - diff,
      'day',
    )

    return { periodStart: periodStartExtended, periodEnd: periodEndExtended }
  }

  const getDaysInPeriod = (
    periodRef: MaybeRefOrGetter<Period>,
    options: { excludedDays?: DayEnum[], currentPeriod?: Period } = {},
  ) => {
    const { excludedDays, currentPeriod } = options
    const days: Day[] = []
    const period = toValue(periodRef)
    let current = toValue(period).periodStart

    while (current.isSameOrBefore(period.periodEnd)) {
      const day = new Day(current, currentPeriod || period)

      if (!excludedDays?.includes(day.dayOfWeek)) {
        days.push(day)
      }

      current = current.add(1, 'day')
    }

    return days
  }

  /**
   * Checks if the given `from` and `to` dates make sense ~ `fromRef` must be
   * before `toRef` and both must be before the current date.
   */
  const isValidRange = (
    fromRef: MaybeRefOrGetter<Datetime>,
    toRef?: MaybeRefOrGetter<Datetime>,
  ) => {
    const from = toValue(fromRef)
    const to = toValue(toRef)

    // If no `to` date is provided, we assume that the `from` date is valid
    if (!to) {
      return true
    }

    return $date(from).isSameOrBefore($date(to))
  }

  return {
    localeUses24HourTime,
    getExtendedPeriod,
    getDaysInPeriod,
    getPeriod,
    formatDate,
    formatTime,
    parseDate,
    isValidRange,
  }
}

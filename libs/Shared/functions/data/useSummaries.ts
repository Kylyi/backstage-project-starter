// import { get, set } from 'lodash-es'
// import type { IGroupRow } from '~/utils/data/interfaces/group-row.interface'
// import { IItem } from '~/utils/data/types/item.type'
// import { SummaryEnum } from '~/utils/data/enums/summary.enum'
// import { TableColumn } from '~/components/MyTable/models/table-column.model'
// import { IGroupedItem } from '~/utils/data/functions/useGrouping'

// export const useSummaries = () => {
//   const createSummaries = <T = IItem>(
//     groupedArrayRef: MaybeRefOrGetter<Array<IGroupedItem<T> | IGroupRow<T>>>,
//     grouped: Record<string, any>,
//     summariesRef: MaybeRefOrGetter<TableColumn<T>[]>,
//   ) => {
//     const groupedArray = unref(groupedArrayRef)
//     const summaries = unref(summariesRef)

//     groupedArray.forEach(row => {
//       if ('isGroup' in row) {
//         summaries.forEach(summary => {
//           const path = row.fullPath
//           const data = get(grouped, `${path}.data`) as T[]

//           const summaryValue = summary.summaryFormat
//             ? summary.summaryFormat(data)
//             : calculateSummary<T>(summary.summaryType as SummaryEnum, summary.field, data)

//           set(
//             grouped,
//             `${path}.summary.${summary.field}.${summary.summaryType}`,
//             {
//               label: summary.summaryLabel
//                 ? summary.summaryLabel(summaryValue)
//                 : null,
//               value: summaryValue,
//             },
//           )
//         })
//       }
//     })
//   }

//   const calculateSummary = <T = Record<string, any>>(
//     type: SummaryEnum = SummaryEnum.COUNT,
//     field: keyof T,
//     data: T[],
//   ) => {
//     let values

//     switch (type) {
//       case SummaryEnum.COUNT:
//         return data.length

//       case SummaryEnum.SUM:
//         return data.reduce((agg, row) => (agg += get(row, field) || 0), 0)

//       case SummaryEnum.MEDIAN:
//         values = data.map(row => get(row, field) || 0)
//         values.sort()

//         return values[Math.floor(values.length / 2)].field as number

//       case SummaryEnum.AVERAGE:
//         values = data.reduce((agg, row) => (agg += get(row, field) || 0), 0)

//         return values / data.length

//       default:
//         return data.length
//     }
//   }

//   return { createSummaries }
// }

// @ts-nocheck Some stupid fucking excessively deep bullshit
// A type guard to check if a value should be treated as a primitive
type Primitive = string | number | boolean | null | undefined | Function | Date

// Adjusted Path type to conditionally include the dot
type Path<T extends string | number, U extends string> = U extends ''
  ? `${T}`
  : `${T}${'' extends U ? '' : '.'}${U}`

// NOTE It's possible to change the depth of the path by changing the number in the PathKeys type
type PathKeys<T, D extends number = 3> = [D] extends [never]
  ? never
  : T extends Primitive
    ? ''
    : T extends Array<infer U>
      ? PathKeys<U, Prev[D]>
      : T extends object
        ? {
            [K in keyof T]-?: K extends string | number
              ? Path<K, PathKeys<T[K], Prev[D]>>
              : never
          }[keyof T]
        : never

type Prev = [never, 0, 1, 2, 3, 4]

/**
 * Extracts the keys of an object
 *
 * NOTE: No fucking idea how this works, all chatgpt...
 */
export type ObjectKey<T> = PathKeys<T>

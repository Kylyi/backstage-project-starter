export const pluralRules = {
  'cs-CZ': (value: number) =>
    value === 1 ? 0 : value > 0 && value <= 4 ? 1 : 2,
  'en-US': (value: number) => (value === 1 ? 0 : 1),
}

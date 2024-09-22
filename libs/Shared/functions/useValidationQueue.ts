type ValidationProcessByFieldInput = Record<
  string,
  [() => void, timeoutMs?: number] | (() => void)
>

export type ValidationProcessByField = Record<
  string,
  Array<[() => void, timeoutMs?: number]>
>

// FIXME: This will break when child components are unmounted
/**
 * In some cases, the validation fields are hidden (for example when they are
 * on a non-visible tab). In our `ValidationDrawer` component, we let users click
 * on an invalid field that should focus the field. Obviously, if the field is hidden,
 * the focus will not work, so we need this process to "show" the field before focusing it.
 *
 * Example
 * We have a form with 2 tabs. The second tab has a required field (`name`) that is not filled.
 * The first tab is currently selected, so the field on second tab is hidden.
 * We use this function as follows:
 *
 * useValidationQueue {
 *   name: [() => { tab.value = 'second' }, 500],
 * }
 *
 * This function also "collects" all the validation processes from all the child
 * components and calls all the functions from the process.
 */
export function useValidationQueue(
  _validationProcessByField: ValidationProcessByFieldInput = {},
) {
  const validationProcessByField = inject(
    '__v',
    ref<ValidationProcessByField>({}),
  )

  Object.entries(_validationProcessByField).forEach(([key, value]) => {
    if (validationProcessByField.value[key]) {
      if (Array.isArray(value)) {
        validationProcessByField.value[key].push(value)
      } else {
        validationProcessByField.value[key].push([value])
      }
    } else if (Array.isArray(value)) {
      validationProcessByField.value[key] = [value]
    } else {
      validationProcessByField.value[key] = [[value]]
    }
  })

  provide('__v', validationProcessByField)

  return validationProcessByField
}

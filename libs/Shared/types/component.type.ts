// https://github.com/vuejs/language-tools/issues/3206
import type { AllowedComponentProps, DefineComponent, VNodeProps } from 'vue'

export type ComponentInstance<T> = T extends new (...args: any[]) => infer R
  ? R
  : T extends (...args: any[]) => infer R
    ? R extends { __ctx?: infer K }
      ? Exclude<K, void> extends { expose: (...args: infer K) => void }
        ? K[0] & InstanceType<DefineComponent>
        : any
      : any
    : any

export type ComponentProps<C extends Component> = C extends new (
  ...args: any
) => any
  ? Omit<
    InstanceType<C>['$props'],
      keyof VNodeProps | keyof AllowedComponentProps
  >
  : never

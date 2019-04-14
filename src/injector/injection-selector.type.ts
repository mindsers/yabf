import { InjectionClass } from './injection-class.type'
import { InjectionToken } from './injection-token.class'

export type InjectionSelector<T> = InjectionToken<T> | InjectionClass<T>

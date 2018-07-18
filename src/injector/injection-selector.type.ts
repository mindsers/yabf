import { InjectionClass } from './injection-class.interface'
import { InjectionToken } from './injection-token.class'

export type InjectionSelector<T> = InjectionToken<T> | InjectionClass<T>

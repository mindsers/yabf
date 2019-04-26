import { InjectionClass } from './injection-class.type'
import { InjectionSelector } from './injection-selector.type'
import { IInjectionType } from './injection-type.interface'

export interface IDependencyInjectionProvider {
  provide<C>(id: InjectionClass<C>|IInjectionType<C>, params?: InjectionSelector<any>[], singleton?: boolean): void
  get<C>(id: InjectionSelector<C>): C | null
}

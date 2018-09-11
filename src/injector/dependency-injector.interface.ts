import { InjectionClass } from './injection-class.interface'
import { InjectionSelector } from './injection-selector.type'
import { InjectionType } from './injection-type.interface'

export interface IDependencyInjectionProvider {
  provide<C>(id: InjectionClass<C>|InjectionType<C>, params?: InjectionSelector<any>[], singleton?: boolean): void
  get<C>(id: InjectionSelector<C>): C | null
}

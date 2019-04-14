import { InjectionClass } from './injection-class.type'
import { InjectionSelector } from './injection-selector.type'

export interface IInjectionType<T> {
  identity: InjectionSelector<T>
  useValue?: any
  useClass?: InjectionClass<any>
}

import { InjectionClass } from './injection-class.interface'
import { InjectionSelector } from './injection-selector.type'

export interface InjectionType<T> {
  identity: InjectionSelector<T>
  useValue?: any
  useClass?: InjectionClass<any>
}

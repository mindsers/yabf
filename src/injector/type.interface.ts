import { InjectionToken } from './injection-token.class'

export interface InjectionClass<T> extends Function {
  new (...args: any[]): T
}

export interface InjectionType<T> {
  identity: InjectionSelector<T>
  useValue?: any
  useClass?: InjectionClass<any>
}

export type InjectionSelector<T> = InjectionToken<T>|InjectionClass<T>

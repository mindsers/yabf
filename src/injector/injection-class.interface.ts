export interface InjectionClass<T> extends Function {
  new(...args: any[]): T
}

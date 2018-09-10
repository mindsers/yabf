import { InjectionClass } from '../injector/injection-class.interface'
import { InjectionSelector } from '../injector/injection-selector.type'
import { InjectionType } from '../injector/injection-type.interface'
import { InjectorService } from '../injector/injector.class'

export abstract class BaseApplication {
  constructor(private injectorService: InjectorService) {}

  provide<C>(className: InjectionType<C>): void
  provide<C>(className: InjectionClass<C>, dependencies?: InjectionSelector<any>[]): void
  provide<C>(className: InjectionClass<C>|InjectionType<C>, dependencies?: InjectionSelector<any>[]): void {
    this.injectorService.provide(className as InjectionClass<C>, dependencies)
  }
}

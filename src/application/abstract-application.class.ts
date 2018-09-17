import { IDependencyInjectionProvider } from '../injector/dependency-injector.interface'
import { InjectionClass } from '../injector/injection-class.interface'
import { InjectionSelector } from '../injector/injection-selector.type'
import { InjectionType } from '../injector/injection-type.interface'
import { InjectorService } from '../injector/injector.class'
import { MissingBuildInstruction } from './missing-build-instruction-error.class'

export abstract class AbstractApplication {
  static createInstance<T extends AbstractApplication>(): T {
    const injector = InjectorService.getMainInstance()
    const [appData, ...data] = this.prototype.buildInstructions()

    if (appData == null) {
      throw new MissingBuildInstruction(`Unable to build ${this.constructor.name}. Build instruction is missing.`)
    }

    const app = injector.get(appData.provide) as T

    if (app != null) {
      return app
    }

    injector.provide(appData.provide, [InjectorService, ...appData.dependencies])

    for (const item of data) {
      injector.provide(item.provide, item.dependencies)
    }

    return injector.get(appData.provide) as T
  }

  constructor(protected injectorService: IDependencyInjectionProvider) {}

  provide<C>(className: InjectionType<C>): void
  provide<C>(className: InjectionClass<C>, dependencies?: InjectionSelector<any>[]): void
  provide<C>(className: InjectionClass<C>|InjectionType<C>, dependencies?: InjectionSelector<any>[]): void {
    this.injectorService.provide(className as InjectionClass<C>, dependencies)
  }

  abstract start(): void
  protected abstract buildInstructions(): IBuildInstruction[]
}

export interface IBuildInstruction {
  provide: InjectionClass<any>
  dependencies: InjectionSelector<any>[]
}

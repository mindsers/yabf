import { IDependencyInjectionProvider } from '../injector/dependency-injector.interface'
import { InjectionClass } from '../injector/injection-class.interface'
import { InjectionSelector } from '../injector/injection-selector.type'
import { InjectionType } from '../injector/injection-type.interface'
import { InjectorService } from '../injector/injector.class'

export abstract class AbstractApplication {
  static createInstance<T extends AbstractApplication>(): T {
    const injector = InjectorService.getMainInstance()
    const [appData, ...data] = this.prototype.buildInstructions()
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

  constructor(protected injectorService: IDependencyInjectionProvider) {
    const constructor = this.constructor as { createInstance?: any; name: string }

    if (constructor.createInstance == null || typeof constructor.createInstance !== 'function') {
      console.warn(
        `The static factory method "createInstance" haven't been created in class ${constructor.name}.`,
        `This behavior will be depracated and removed in future version.`,
      )
    }
  }

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

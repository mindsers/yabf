import { LoggerService } from '../logger/logger.class'

import { IDependencyInjectionProvider } from './dependency-injector.interface'
import { InjectionClass } from './injection-class.interface'
import { InjectionSelector } from './injection-selector.type'
import { InjectionToken } from './injection-token.class'
import { InjectionType } from './injection-type.interface'

export class InjectorService implements IDependencyInjectionProvider {
  static instances: InjectorInstance<any>[] = []

  private data: InjectionData[] = []
  private log?: (message: string) => void

  static getMainInstance(): InjectorService {
    const existingInstance = InjectorService.instances
      .find(instance => instance.value instanceof InjectorService)

    if (existingInstance != null) {
      return existingInstance.value as InjectorService
    }

    const injector = new InjectorService()

    injector.provide({ identity: InjectorService, useValue: injector })
    injector.provide(LoggerService)

    injector.addLoggerService(injector.get(LoggerService) as LoggerService)

    return injector.get(InjectorService) as InjectorService
  }

  addLoggerService(loggerService: LoggerService) {
    this.log = loggerService.registerScope('yabf:injector')
  }

  provide<C>(givenData: InjectionType<C>): void
  provide<C>(givenData: InjectionClass<C>, params?: InjectionSelector<any>[], singleton?: boolean): void
  provide<C>(givenData: InjectionClass<C>|InjectionType<C>, params: InjectionSelector<any>[] = [], singleton = true) {
    const data = this.buildPovidedData(givenData)

    if (data == null || (data.useClass == null && data.useValue == null)) {
      return
    }

    const alreadyExist = this.data
      .filter(service => service.identity === data.identity)
      .length > 0

    if (alreadyExist) {
      return
    }

    data.singleton = singleton
    data.constructorParams = data.useValue == null ? params : []

    this.data.push(data)
  }

  get<C>(identity: InjectionSelector<C>): C | null {
    const existingInstance = InjectorService.instances.find(i => {
      const useClass = !(identity instanceof InjectionToken) && i.value instanceof identity
      const useToken = identity instanceof InjectionToken && i.identity === identity

      return useToken || useClass
    })

    if (existingInstance != null) {
      return existingInstance.value as C
    }

    return this.buildInstance(identity)
  }

  private buildInstance<C>(identity: InjectionSelector<C>): C | null {
    const data = this.data.find(d => d.identity === identity)

    if (data == null) {
      if (this.log != null) {
        this.log(`No data regitered with key : ${identity.constructor.name}`)
      }

      return null
    }

    const instance = this.buildInstanceFromData<C>(data)

    if (data.singleton === true) {
      InjectorService.instances.push(instance)
    }

    return instance.value as C
  }

  private buildInstanceFromData<C>(data: InjectionData): InjectorInstance<C> {
    let instance: InjectorInstance<C> | null = null

    if (data.useClass != null) {
      const Class = data.useClass // tslint:disable-line:variable-name
      const args = data.constructorParams.map(param => this.get(param))

      instance = {
        identity: data.identity,
        value: new Class(...args),
      }
    }

    if (data.useValue != null) {
      instance = {
        identity: data.identity,
        value: data.useValue,
      }
    }

    return instance as InjectorInstance<C>
  }

  private buildPovidedData<C>(givenData: InjectionClass<C>|InjectionType<C>): InjectionData|null {
    const defaultProps = {
      constructorParams: [],
      singleton: true,
    }

    if (givenData instanceof Function) {
      return {
        identity: givenData,
        useClass: givenData,
        ...defaultProps,
      }
    }

    if ('identity' in givenData) {
      if ('useClass' in givenData && !('useValue' in givenData)) {
        return {
          identity: givenData.identity,
          useClass: givenData.useClass,
          ...defaultProps,
        }
      }

      if ('useValue' in givenData && !('useClass' in givenData)) {
        return {
          identity: givenData.identity,
          useValue: givenData.useValue,
          ...defaultProps,
        }
      }
    }

    return null
  }
}

interface InjectionData extends InjectionType<any> {
  constructorParams: InjectionSelector<any>[]
  singleton: boolean
}

interface InjectorInstance<I> {
  identity: InjectionSelector<I>
  value: any
}

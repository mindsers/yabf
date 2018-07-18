import { InjectionClass } from './injection-class.interface'
import { InjectionSelector } from './injection-selector.type'
import { InjectionToken } from './injection-token.class'
import { InjectionType } from './injection-type.interface'

export class InjectorService {
  static instances: any[] = []

  private data: IProvidedData[] = []

  static getMainInstance(): InjectorService {
    const previousInstance = InjectorService.instances
      .find((instance: any) => instance.value instanceof InjectorService)

    if (previousInstance != null) {
      return previousInstance.value
    }

    const injector = new InjectorService()
    injector.provide({ identity: InjectorService, useValue: injector })

    return injector.get(InjectorService) as InjectorService
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

    if (data.useValue == null) {
      data.contructorParams = params.map<IProvidedData>(param => {
        // if ('useValue' in param) {
        //   return {
        //     contructorParams: [],
        //     identity: null,
        //     singleton: false,
        //     useValue: param.useValue,
        //   }
        // }

        return {
          contructorParams: [],
          identity: param,
          singleton: false,
          useClass: param,
        }
      })
    }

    this.data.push(data)
  }

  get<C>(identity: InjectionClass<C>|InjectionToken<C>): C|null {
    const previousInstance = InjectorService
      .instances
      .find((instance: any) =>
        identity instanceof InjectionToken && instance.identity === identity ||
        !(identity instanceof InjectionToken) && instance.value instanceof identity,
      )

    if (previousInstance != null) {
      return previousInstance.value
    }

    const data = this.data.find((d: IProvidedData) => d.identity === identity)

    if (data != null) {
      let instance: any = null

      if (data.useClass != null) {
        const Class = data.useClass // tslint:disable-line:variable-name
        const args = data.contructorParams.map((param: any) => {
          if (param.useClass != null) {
            return this.get(param.useClass)
          }

          return param.useValue
        })

        instance = {}
        instance.identity = data.identity
        instance.value = new Class(...args)
      }

      if (data.useValue != null) {
        instance = {}
        instance.identity = data.identity
        instance.value = data.useValue
      }

      if (data.singleton === true) {
        InjectorService.instances.push(instance)
      }

      return instance.value
    }

    console.warn(`WARN: No data regitered with key : ${identity.constructor.name}`)

    return null
  }

  private buildPovidedData(givenData: any): IProvidedData|null {
    const data: IProvidedData = {
      contructorParams: [],
      singleton: true,
    }

    if (givenData instanceof Function) {
      data.identity = givenData
      data.useClass = givenData
    }

    if ('identity' in givenData && !('identity' in data)) {
      data.identity = givenData.identity
    }

    if ('useClass' in givenData && !('useValue' in givenData)) {
      data.useClass = givenData.useClass
    }

    if ('useValue' in givenData && !('useClass' in givenData)) {
      data.useValue = givenData.useValue
    }

    if (data.identity == null && (data.useClass == null || data.useValue == null)) {
      return null
    }

    return data
  }
}

interface IProvidedData {
  identity?: any
  useClass?: any
  useValue?: any
  contructorParams: any[]
  singleton: boolean
}

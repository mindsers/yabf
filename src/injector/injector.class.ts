import { InjectionToken } from './injection-token.class';

export class InjectorService {
  private data: ProvidedData[] = []

  public static instances: any[] = []

  static getMainInstance() {
    const previousInstance = InjectorService.instances.find((instance: any) => instance.value instanceof InjectorService)

    if (previousInstance != null) {
      return previousInstance.value
    }

    const injector = new InjectorService()
    injector.provide({ identity: InjectorService, useValue: injector })

    return injector.get(InjectorService)
  }

  provide(givenData: any, params = [], singleton = true) {
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
      data.contructorParams = params.map<ProvidedData>((param: any) => {
        if ('useValue' in param) {
          return {
            identity: null,
            useValue: param.useValue,
            contructorParams: [],
            singleton: false
          }
        }

        return {
          identity: param,
          useClass: param,
          contructorParams: [],
          singleton: false
        }
      })
    }

    this.data.push(data)
  }

  get(identity: any) {
    const previousInstance = InjectorService
      .instances
      .find((instance: any) =>
        identity instanceof InjectionToken && instance.identity === identity ||
        !(identity instanceof InjectionToken) && instance.value instanceof identity
      )

    if (previousInstance != null) {
      return previousInstance.value
    }

    const data = this.data.find((data: ProvidedData) => data.identity === identity)

    if (data != null) {
      let instance: any = null

      if (data.useClass != null) {
        const Class = data.useClass
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

  private buildPovidedData(givenData: any): ProvidedData|null {
    const data: ProvidedData = {
      contructorParams: [],
      singleton: true
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

interface ProvidedData {
  identity?: any
  useClass?: any
  useValue?: any
  contructorParams: any[]
  singleton: boolean
}


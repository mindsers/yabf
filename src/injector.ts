export class InjectorService {
  constructor() {
    this.data = []
  }

  static getMainInstance() {
    const previousInstance = InjectorService.instances.find(instance => instance.value instanceof InjectorService)

    if (previousInstance != null) {
      return previousInstance.value
    }

    const injector = new InjectorService()
    injector.provide({ identity: InjectorService, useValue: injector })

    return injector.get(InjectorService)
  }

  provide(givenData, params = [], singleton = true) {
    const data = this._buildPovidedData(givenData)

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
      data.contructorParams = params.map(param => {
        if (param.useValue != null) {
          return {
            identity: null,
            useValue: param.useValue
          }
        }

        return {
          identity: param,
          useClass: param
        }
      })
    }

    this.data.push(data)
  }

  get(identity) {
    const previousInstance = InjectorService
      .instances
      .find(instance =>
        identity instanceof InjectionToken && instance.identity === identity ||
        !(identity instanceof InjectionToken) && instance.value instanceof identity
      )

    if (previousInstance != null) {
      return previousInstance.value
    }

    const data = this.data.find(data => data.identity === identity)

    if (data != null) {
      let instance = null

      if (data.useClass != null) {
        const Class = data.useClass
        const args = data.contructorParams.map(param => {
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

  _buildPovidedData(givenData) {
    const data = {}

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

    data.contructorParams = []
    data.singleton = true

    return data
  }
}

InjectorService.instances = []

export class InjectionToken {}

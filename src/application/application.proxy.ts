import { WebApplication } from './web-application.class'

const applicationProxy = new Proxy(WebApplication, {
  construct(target, argumentsList) {
    console.warn('WARNING: `Application` class is depracated since 2.0.0. Please use `WebApplication` instead')

    return Reflect.construct(target, argumentsList)
  },
})

export { applicationProxy as Application }

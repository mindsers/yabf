import { LoggerService } from '../logger/logger.class'

import { WebApplication } from './web-application.class'

const applicationProxy = new Proxy(WebApplication, {
  construct(target, argumentsList: [any, any, LoggerService]) {
    const [, , loggerService] = argumentsList
    const scope = 'yabf:application'
    const message = 'WARNING: `Application` class is depracated since 2.0.0. Please use `WebApplication` instead'

    loggerService.log(scope, message)

    return Reflect.construct(target, argumentsList)
  },
})

export { applicationProxy as Application }

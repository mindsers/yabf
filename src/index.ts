import { Application } from './application/application.class'
import { InjectorService } from './injector/injector.class'
import { RouterService } from './router/router.class'

(() => {
    const injector = InjectorService.getMainInstance()

    injector.provide(Application, [InjectorService, RouterService])
    injector.provide(RouterService, [InjectorService])
})()

export * from './application/application.class'
export * from './controller/controller.class'
export * from './injector/injector.class'
export * from './injector/injection-token.class'
export * from './http/request.class'
export * from './http/response.class'
export * from './router/router.class'
export * from './router/http-method.enum'

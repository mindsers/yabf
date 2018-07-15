import { InjectorService } from './injector'
import { Application } from './application'
import { RouterService } from './router'

(() => {
    const injector = InjectorService.getMainInstance()

    injector.provide(Application, [InjectorService, RouterService])
    injector.provide(RouterService, [InjectorService])
})()

export * from './application'
export * from './controller'
export * from './injector'
export * from './request'
export * from './response'
export * from './router'

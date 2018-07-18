import * as http from 'http'

import { InjectionToken } from '../injector/injection-token.class'
import { InjectorService } from '../injector/injector.class'
import { InjectionClass, InjectionSelector, InjectionType } from '../injector/type.interface'
import { RouterService } from '../router/router.class'

import { ControllerInControllerError } from './controller-in-controller-error.class'

export class Application {
  constructor(
    private injectorService: InjectorService,
    private routerService: RouterService,
  ) {}

  static fromInjectorScope(): Application {
    const injector = InjectorService.getMainInstance()
    const app = injector.get(Application)

    if (app != null) {
      return app
    }

    injector.provide(Application, [InjectorService, RouterService])
    injector.provide(RouterService, [InjectorService])

    return injector.get(Application) as Application
  }

  provide<C>(className: InjectionType<C>): void
  provide<C>(className: InjectionClass<C>, dependencies?: InjectionSelector<C>[]): void
  provide<C>(className: InjectionClass<C>|InjectionType<C>, dependencies?: InjectionSelector<C>[]): void {
    this.injectorService.provide(className as InjectionClass<C>, dependencies)
  }

  declare(className: any, options = []) {
    for (const option of options) {
      if (this.routerService.isRegistered(option)) {
        throw new ControllerInControllerError(option, className)
      }
    }

    this.injectorService.provide(className, options, false)
    this.routerService.register(className)
  }

  start() {
    const config = this.getConfiguration()

    if (config.cors) {
      this.routerService.enableCORS(config.corsOrigins, config.corsHeaders)
    }

    http
      .createServer((request, response) => {
        this.routerService.httpServerMiddleware(request, response)
          .catch(error => {
            console.warn(error)
          })
      })
      .listen(config.port)

    console.info(`Listen on 127.0.0.1:${config.port}`)
  }

  private getConfiguration() {
    const config = this.injectorService.get(APP_CONFIG) == null
      ? {}
      : this.injectorService.get(APP_CONFIG)

    if (config.port == null || typeof config.port !== 'number') {
      config.port = 8080
    }

    if (config.defaultLocale == null) {
      config.defaultLocale = 'en'
    }

    if (config.locales == null || !Array.isArray(config.port)) {
      config.locales = ['en']
    }

    if (config.cors == null || typeof config.cors !== 'boolean') {
      config.cors = true
    }

    if (config.corsHeaders == null || !Array.isArray(config.corsHeaders)) {
      config.corsHeaders = []
    }

    if (config.corsOrigins == null || !Array.isArray(config.corsOrigins)) {
      config.corsOrigins = []
    }

    return config
  }
}

export const APP_CONFIG = new InjectionToken<any>()

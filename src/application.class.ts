import * as http from 'http'

import { InjectorService } from './injector/injector.class'
import { InjectionToken } from "./injector/injection-token.class";
import { RouterService } from './router/router.class'
import { Controller } from './controller/controller.class'

export class Application {
  constructor(
    private injectorService: InjectorService,
    private routerService: RouterService
  ) {}

  provide(className: any, options = []) {
    this.injectorService.provide(className, options)
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
      })
      .listen(config.port)

    console.log(`Listen on 127.0.0.1:${config.port}`)
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

class ControllerInControllerError extends Error {
  constructor(controller: Controller, parentController: Controller) {
    super(`Provide a controller to an other controller is forbidden. (${controller} into ${parentController})`)
  }
}

export const APP_CONFIG = new InjectionToken()

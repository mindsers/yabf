import http from 'http'

import { InjectionToken } from './injector'

export class Application {
  constructor(injectorService, routerService) {
    this.injector = injectorService
    this.routerService = routerService
  }

  provide(className, options = []) {
    this.injector.provide(className, options)
  }

  declare(className, options = []) {
    for (const option of options) {
      if (this.routerService.isRegistered(option)) {
        throw new ControllerInControllerError(option, className)
      }
    }

    this.injector.provide(className, options, false)
    this.routerService.register(className)
  }

  start() {
    const config = this._getConfiguration()

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

  _getConfiguration() {
    const config = this.injector.get(APP_CONFIG) == null
      ? {}
      : this.injector.get(APP_CONFIG)

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
  constructor(controller, parentController) {
    super(`Provide a controller to an other controller is forbidden. (${controller} into ${parentController})`)
  }
}

export const APP_CONFIG = new InjectionToken()


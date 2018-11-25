import * as http from 'http'

import { Controller } from '../controller/controller.class'
import { InjectionClass } from '../injector/injection-class.interface'
import { InjectionSelector } from '../injector/injection-selector.type'
import { InjectorService } from '../injector/injector.class'
import { RouterService } from '../router/router.class'

import { AbstractApplication } from './abstract-application.class'
import { APP_CONFIG, IAppConfig } from './app-config.interface'
import { ControllerInControllerError } from './controller-in-controller-error.class'

export class WebApplication extends AbstractApplication {
  constructor(injectorService: InjectorService, private routerService: RouterService) {
    super(injectorService)
  }

  declare<C extends Controller>(className: InjectionClass<C>, dependencies: InjectionSelector<any>[] = []) {
    for (const dependency of dependencies) {
      if (this.routerService.isRegistered(dependency as InjectionClass<Controller>)) {
        throw new ControllerInControllerError(
          dependency as InjectionClass<Controller>,
          className as InjectionClass<Controller>,
        )
      }
    }

    this.injectorService.provide(className as InjectionClass<C>, dependencies, false)
    this.routerService.register(className)
  }

  start(): void {
    const config = this.getConfiguration()

    if (config.cors) {
      this.routerService.enableCORS(config.cors.origins, config.cors.headers)
    }

    http
      .createServer((request, response) => {
        this.routerService.httpServerMiddleware(request, response)
          .catch(error => {
            console.warn(error)
          })
      })
      .listen(config.server.port)

    console.info(`Listen on 127.0.0.1:${config.server.port}`)
  }

  protected buildInstructions() {
    return [
      { provide: WebApplication, dependencies: [RouterService] },
      { provide: RouterService, dependencies: [InjectorService] },
    ]
  }

  private getConfiguration(): IAppConfig {
    let config = this.injectorService.get(APP_CONFIG)

    if (config == null) {
      config = {
        server: {
          port: 8080,
        },
      }
    }

    if (typeof config.server.port !== 'number') {
      config.server.port = 8080
    }

    if (config.locales == null) {
      config.locales = {}
    }

    if (config.locales.list == null || !Array.isArray(config.locales.list)) {
      config.locales.list = ['en']
    }

    if (config.locales.default == null || config.locales.default === '') {
      config.locales.default = config.locales.list[0]
    }

    if (config.cors == null) {
      config.cors = {
        activated: false,
        origins: [],
      }
    }

    if (config.cors.headers == null || !Array.isArray(config.cors.headers)) {
      config.cors.headers = []
    }

    if (config.cors.origins == null || !Array.isArray(config.cors.origins)) {
      config.cors.origins = []
    }

    return config
  }
}

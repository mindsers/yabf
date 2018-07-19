import { IAction } from '../controller/action.interface'
import { IController } from '../controller/controller.interface'
import { Request } from '../http/request.class'
import { Response as ResponseHelper } from '../http/response.class'
import { InjectionClass } from '../injector/injection-class.interface'
import { InjectorService } from '../injector/injector.class'

import { IConsolidatedRoute } from './consolidated-route.interface'
import { HttpMethod } from './http-method.enum'

export class RouterService {

  get controllers(): IController[] {
    return this._controllers
      .map(controllerName => this.injectorService.get(controllerName))
      .filter(controller => controller != null) as IController[]
  }

  get routes(): IConsolidatedRoute[] {
    return this.controllers
      .map(controller => {
        return controller.routes
          .map(route => {
            if (route.action in controller && typeof route.action === 'string') {
              const action = controller[route.action] as IAction
              route.action = action.bind(controller)
            }

            return route as IConsolidatedRoute
          })
      })
      .reduce((routes, curr) => ([...routes, ...curr]), [])
      .filter(route => typeof route.action === 'function')
  }

  private _controllers: InjectionClass<IController>[] = []
  private cors: { enabled: boolean; allowedOrigins: string[]; allowedHeaders: string[] } = {
    allowedHeaders: [],
    allowedOrigins: [],
    enabled: false,
  }

  constructor(private injectorService: InjectorService) {}

  enableCORS(origins: string[], headers: string[] = []) {
    this.cors.enabled = true
    this.cors.allowedHeaders = headers
    this.cors.allowedOrigins = origins
  }

  disableCORS() {
    this.cors.enabled = false
    this.cors.allowedOrigins = []
    this.cors.allowedHeaders = []
  }

  isRegistered(controllerName: any) {
    return this._controllers.includes(controllerName)
  }

  register(controllerName: any) {
    if (controllerName == null || typeof controllerName !== 'function') {
      return
    }

    this._controllers.push(controllerName)
  }

  async httpServerMiddleware(request: any, response: any) {
    const requestHelper = new Request(request)

    if (requestHelper.isCORS && this.cors.enabled) {
      this.sendCORSResponse(response, requestHelper)

      return
    }

    const responseHelper = await this.processResponse(requestHelper)

    if (this.cors.enabled) {
      this.addCORSHeadersToResponse(responseHelper, requestHelper)
    }

    responseHelper.send(response)
  }

  private async processResponse(request: any) {
    let response = null

    for (const route of this.routes) {
      if (request.match(route.path) && route.methodes.includes(request.method)) {
        let result = route.action(request)

        if (result instanceof Promise) {
          result = await result
        }

        if (result instanceof ResponseHelper) {
          response = result
          break
        }

        response = new ResponseHelper(result)
        break
      }
    }

    if (response == null) {
      response = new ResponseHelper(null, 404, 'Endpoint not found.')
    }

    return response
  }

  private sendCORSResponse(response: any, request: any) {
    const headers = this.processCORSResponseHeaders(request)

    headers['Content-Length'] = '0'
    headers['Content-Type'] = 'text/plain'

    response.writeHead(200, headers)
    response.end()
  }

  private addCORSHeadersToResponse(response: any, request: any) {
    const headers = this.processCORSResponseHeaders(request)

    for (const header of Object.keys(headers)) {
      response.setHeader(header, headers[header])
    }

    return response
  }

  private processCORSResponseHeaders(request: any): { [key: string]: string } {
    const headers: { [key: string]: string } = {}

    headers['Access-Control-Allow-Origin'] = this.cors.allowedOrigins.includes(request.headers.origin)
      ? request.headers.origin
      : null
    headers['Access-Control-Allow-Headers'] = this.cors.allowedHeaders.join(', ')
    headers['Access-Control-Allow-Methods'] = this.routes
      .filter(route => request.match(route.path))
      .map(route => route.methodes)
      .reduce((aggr, curr) => [...aggr, ...curr], [])
      .reduce((aggr: (HttpMethod|null)[], curr: HttpMethod) => [...aggr, !aggr.includes(curr) ? curr : null], [])
      .filter(method => method != null)
      .join(', ')
      .toUpperCase()

    for (const header of Object.keys(headers)) {
      if (headers[header] == null || headers[header] === '') {
        delete headers[header]
      }
    }

    return headers
  }
}

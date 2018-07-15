import { Response as ResponseHelper } from './response'
import { Request } from './request';

export class RouterService {

  get controllers() {
    return this._controllers.map(controllerName => this.injectorService.get(controllerName))
  }

  get routes() {
    return this.controllers
      .map(controller => controller.routes
          .map(route => {
            if (route.action in controller) {
              route.action = controller[route.action].bind(controller)
            }

            return route
          }))
      .reduce((routes, curr) => ([...routes, ...curr]), [])
      .filter(route => typeof route.action === 'function')
  }

  constructor(injectorService) {
    this.injectorService = injectorService
    this._controllers = []

    this.cors = {
      enabled: false,
      allowedOrigins: [],
      allowedHeaders: []
    }
  }

  enableCORS(origins, headers) {
    this.cors.enabled = true
    this.cors.allowedHeaders = headers
    this.cors.allowedOrigins = origins
  }

  disableCORS() {
    this.cors.enabled = false
    this.cors.allowedOrigins = []
    this.cors.allowedHeaders = []
  }

  isRegistered(controllerName) {
    return this._controllers.includes(controllerName)
  }

  register(controllerName) {
    if (controllerName == null || typeof controllerName !== 'function') {
      return
    }

    this._controllers.push(controllerName)
  }

  async httpServerMiddleware(request, response) {
    const requestHelper = new Request(request)

    if (requestHelper.isCORS && this.cors.enabled) {
      this._sendCORSResponse(response, requestHelper)

      return
    }

    const responseHelper = await this._processResponse(requestHelper)

    if (this.cors.enabled) {
      this._addCORSHeadersToResponse(responseHelper, requestHelper)
    }

    responseHelper.send(response)
  }

  async _processResponse(request) {
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

  _sendCORSResponse(response, request) {
    const headers = this._processCORSResponseHeaders(request)

    headers['Content-Length'] = 0
    headers['Content-Type'] = 'text/plain'

    response.writeHead(200, headers)
    response.end()
  }

  _addCORSHeadersToResponse(response, request) {
    const headers = this._processCORSResponseHeaders(request)

    for (const header of Object.keys(headers)) {
      response.setHeader(header, headers[header])
    }

    return response
  }

  _processCORSResponseHeaders(request) {
    const headers = {}

    headers['Access-Control-Allow-Origin'] = this.cors.allowedOrigins.includes(request.headers['origin'])
      ? request.headers['origin']
      : null
    headers['Access-Control-Allow-Headers'] = this.cors.allowedHeaders.join(', ')
    headers['Access-Control-Allow-Methods'] = this.routes
      .filter(route => request.match(route.path))
      .map(route => route.methodes)
      .reduce((aggr, curr) => [...aggr, ...curr], [])
      .reduce((aggr, curr) => [...aggr, !aggr.includes(curr) ? curr : null], [])
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

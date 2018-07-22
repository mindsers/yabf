import { IncomingHttpHeaders as HttpHeaders, IncomingMessage as HttpRequest } from 'http'
import { parse as parseQuery, ParsedUrlQuery } from 'querystring'
import { parse as parseUrl } from 'url'

import { HttpMethod } from './http-method.enum'

export class Request {
  get pathname(): string | undefined {
    const { url = '' } = this.httpRequest

    return parseUrl(url).pathname
  }

  get querystring(): ParsedUrlQuery {
    const url = this.httpRequest.url
    if (url == null) {
      return {}
    }

    const query = parseUrl(url).query
    if (query == null) {
      return {}
    }

    return parseQuery(query)
  }

  get method(): HttpMethod {
    const method = this.httpRequest.method
    if (method == null) {
      return HttpMethod.GET
    }

    return method.toLowerCase() as HttpMethod
  }

  get headers(): HttpHeaders {
    return this.httpRequest.headers
  }

  get anchor(): string | undefined {
    const url = this.httpRequest.url
    if (url == null) {
      return
    }

    return parseUrl(url).hash
  }

  get body(): Promise<any> {
    let promise = this._body.promise

    if (this._body.dataString.length > 0 || promise == null) {
      promise = Promise.resolve(this._body.dataString)
    }

    return promise.then((body: string): any | undefined => {
      const contentLength = Number(this.httpRequest.headers['content-length'] || '0')

      if (contentLength > 0) {
        return this.parseBody(body)
      }
    })
  }

  get isCORS(): boolean {
    return this.method === HttpMethod.OPTIONS && 'access-control-request-method' in this.headers
  }

  private _body: { data: any[]; dataString: string; promise: Promise<any>|null } = {
    data: [],
    dataString: '',
    promise: null,
  }

  constructor(private httpRequest: HttpRequest) {
    this._body.promise = new Promise((resolve: any, reject: any) => {
      this.httpRequest
        .on('error', (err: any) => { reject(err) })
        .on('data', (data: any) => { this._body.data.push(data) })
        .on('end', () => {
          this._body.dataString = Buffer
            .concat(this._body.data)
            .toString()

          resolve(this._body.dataString)
        })
    })
  }

  match(pattern: string): boolean {
    const patternParts = pattern.split('/')
    const pathParts = (this.pathname || '').split('/')

    if (patternParts.length !== pathParts.length) {
      return false
    }

    for (const [index, part] of patternParts.entries()) {
      if (part !== pathParts[index]) {
        return false
      }
    }

    return true
  }

  private parseBody(body: string): any {
    const contentType = this.headers['content-type']

    if (contentType != null && contentType.includes('application/json')) {
      return JSON.parse(body)
    }

    return body
  }
}

import * as url from 'url'
import * as querystring from 'querystring'

export class Request {
  get pathname(): string {
    const value = url.parse(this.httpRequest.url).pathname

    if (value == null) {
      return ''
    }

    return value
  }

  get querystring() {
    return querystring.parse(url.parse(this.httpRequest.url).query || '')
  }

  get method() {
    return this.httpRequest.method.toLowerCase()
  }

  get headers() {
    return this.httpRequest.headers
  }

  get anchor() {
    return this.httpRequest.hash
  }

  get body() {
    let promise = this._body.promise

    if (this._body.dataString.length > 0 || promise == null) {
      promise = Promise.resolve(this._body.dataString)
    }

    return promise.then((body: any) => {
      if (this.httpRequest.headers['content-length'] > 0) {
        return this.parseBody(body)
      }
    })
  }

  get isCORS() {
    return this.method === 'options' && 'access-control-request-method' in this.headers
  }

  private _body: { data: any[], dataString: string, promise: Promise<any>|null } = {
    data: [],
    dataString: '',
    promise: null
  }

  constructor(private httpRequest: any) {
    this._body.promise = new Promise((resolve: any, reject: any) => {
      this.httpRequest
        .on('error', (err: any) => { reject(err) })
        .on('data', (data: any) => { this._body.data.push(data) })
        .on('end', () => {
          this._body.dataString = Buffer.concat(this._body.data).toString()

          resolve(this._body.dataString)
        })
    })
  }

  match(pattern: any) {
    const patternParts = pattern.split('/')
    const pathParts = this.pathname.split('/')

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

  private parseBody(body: any) {
    if (this.headers['content-type'].includes('application/json')) {
      return JSON.parse(body)
    }

    return body
  }
}

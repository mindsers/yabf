import { Buffer } from 'buffer'

export class Response {
  get contentType() {
    return this.getHeader('Content-Type')
  }

  set contentType(value) {
    this.setHeader('Content-Type', value)
  }

  private headers: any

  constructor(public data: any, public errorCode = 200, public description: string|null = null) {
    this.errorCode = errorCode
    this.data = data
    this.description = description
    this.headers = { 'Content-Type': 'application/json' }
  }

  setHeader(key: any, value: any) {
    this.headers[key] = value
  }

  getHeader(key: any) {
    return this.headers[key]
  }

  send(httpResponse: any) {
    httpResponse.writeHead(this.errorCode, this.headers)

    if (this.getHeader('Content-Type') === 'application/json') {
      httpResponse.write(this._getJSONBody())
    }

    if (this.getHeader('Content-Type') === 'application/octet-stream') {
      httpResponse.write(Buffer.from(this.data, 'binary'))
    }

    httpResponse.end()
  }

  _getJSONBody() {
    const body: any = {
      error: Math.floor(this.errorCode / 100) !== 2,
      errorCode: this.errorCode,
    }

    if (this.description != null) {
      body.description = this.description
    }

    if (this.data != null) {
      body.data = this.data
    }

    return JSON.stringify(body)
  }
}

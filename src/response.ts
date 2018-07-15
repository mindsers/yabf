import { Buffer } from 'buffer'

export class Response {
  get contentType() {
    return this.getHeader('Content-Type')
  }

  set contentType(value) {
    this.setHeader('Content-Type', value)
  }

  constructor(data, errorCode = 200, description = null) {
    this.errorCode = errorCode
    this.data = data
    this.description = description
    this.headers = { 'Content-Type': 'application/json' }
  }

  setHeader(key, value) {
    this.headers[key] = value
  }

  getHeader(key) {
    return this.headers[key]
  }

  send(httpResponse) {
    httpResponse.writeHead(this.errorCode, this.headers)

    if (this.getHeader('Content-Type') === 'application/json') {
      httpResponse.write(this._getJSONBody())
    }

    if (this.getHeader('Content-Type') === 'application/octet-stream') {
      httpResponse.write(new Buffer(this.data, 'binary'))
    }

    httpResponse.end()
  }

  _getJSONBody() {
    const body = {
      errorCode: this.errorCode,
      error: Math.floor(this.errorCode / 100) !== 2
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

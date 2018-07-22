import { Buffer } from 'buffer'
import { ServerResponse as HttpResponse } from 'http'

export class Response {
  get contentType(): string {
    return this.getHeader('Content-Type')
  }

  set contentType(value: string) {
    this.setHeader('Content-Type', value)
  }

  private headers: { [key: string]: string } = { 'Content-Type': 'application/json' }

  constructor(public data: any, public errorCode = 200, public description: string|null = null) {}

  setHeader(key: string, value: string): void {
    this.headers[key] = value
  }

  getHeader(key: string): string {
    return this.headers[key]
  }

  send(httpResponse: HttpResponse): void {
    httpResponse.writeHead(this.errorCode, this.headers)

    if (this.getHeader('Content-Type') === 'application/json') {
      httpResponse.write(this.getJSONBody())
    }

    if (this.getHeader('Content-Type') === 'application/octet-stream') {
      httpResponse.write(Buffer.from(this.data, 'binary'))
    }

    httpResponse.end()
  }

  private getJSONBody(): string {
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

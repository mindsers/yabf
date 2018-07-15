import url from 'url'
import querystring from 'querystring'

export class Request {
  get pathname() {
    return url.parse(this._httpRequest.url).pathname
  }

  get querystring() {
    return querystring.parse(url.parse(this._httpRequest.url).query)
  }

  get method() {
    return this._httpRequest.method.toLowerCase()
  }

  get headers() {
    return this._httpRequest.headers
  }

  get anchor() {
    return this._httpRequest.hash
  }

  get body() {
    const promise = this._body.promise

    if (this._body.dataString.length > 0) {
      promise = Promise.resolve(this._body.dataString)
    }

    return promise.then(body => {
      if (this._httpRequest.headers['content-length'] > 0) {
        return this._parseBody(body)
      }
    })
  }

  get isCORS() {
    return this.method === 'options' && 'access-control-request-method' in this.headers
  }

  constructor(httpRequest) {
    this._httpRequest = httpRequest

    this._body = {
      data: [],
      dataString: "",
      promise: null
    }

    this._body.promise = new Promise((resolve, reject) => {
      this._httpRequest
        .on('error', err => { reject(err) })
        .on('data', data => { this._body.data.push(data) })
        .on('end', () => {
          this._body.dataString = Buffer.concat(this._body.data).toString()

          resolve(this._body.dataString)
        })
    })
  }

  match(pattern) {
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

  _parseBody(body) {
    if (this.headers['content-type'].includes('application/json')) {
      return JSON.parse(body)
    }

    return body
  }
}

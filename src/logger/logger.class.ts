import { format } from 'util'

import { ILoggerScope } from './logger-scope.interface'

const colors = [35, 33, 37, 32, 31, 36, 34]

export class LoggerService {
  private scopes: ILoggerScope[] = []
  private internalScope: ILoggerScope = { namespace: 'yabf:logger', color: 36, lastWrite: null }

  registerScope(namespace: string) {
    const isReserved = new RegExp(`^${this.internalScope.namespace}`)
    if (isReserved.test(namespace)) {
      this.write(`Unable to register this scope. Do not use a reserved namespace`, this.internalScope)
      throw new TypeError('Namespace reserved')
    }

    const scope = this.scopes.find(s => s.namespace === namespace)
    if (scope == null) {
      const previousScope = this.scopes[this.scopes.length - 1] || {}
      const color = colors[colors.indexOf(previousScope.color) + 1] || colors[0]

      this.scopes = [...this.scopes, { namespace, color, lastWrite: null }]
    }

    return (message: string) => this.log(namespace, message)
  }

  log(namespace: string, message: string) {
    const scope = this.scopes.find(s => s.namespace === namespace)

    if (scope == null) {
      this.write(`No scope found for namespace "${namespace}"`, this.internalScope)

      return
    }

    this.write(message, scope)
  }

  private write(message: string, { namespace, color  }: ILoggerScope) {
    const prefix = `\x1b[${color}m${namespace}\x1b[0m`

    process.stderr.write(`${prefix} ${format(message)}\n`)
  }
}
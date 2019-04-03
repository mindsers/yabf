import { format } from 'util'

import { ILoggerScope } from './logger-scope.interface'

const colors = [35, 33, 37, 32, 31, 36, 34]

export class LoggerService {
  output: { write(message: string): void } = process.stderr

  private scopes: ILoggerScope[] = []
  private internalScope: ILoggerScope = { namespace: 'yabf:logger', color: 36 }
  private authorizedNamespaces: string[] = []

  constructor(private namespaceFilters?: string) {}

  registerScope(namespace: string) {
    const isReserved = new RegExp(`^${this.internalScope.namespace}`)
    if (isReserved.test(namespace)) {
      throw new Error(`Unable to register this scope. Do not use a reserved namespace`)
    }

    const scope = this.scopes.find(s => s.namespace === namespace)
    if (scope == null) {
      const previousScope = this.scopes[this.scopes.length - 1] || {}
      const color = colors[colors.indexOf(previousScope.color) + 1] || colors[0]

      this.scopes = [...this.scopes, { namespace, color }]
    }

    this.updateAuthorizedNamespaces()

    return (message: string) => this.log(namespace, message)
  }

  log(namespace: string, message: string): void {
    const scope = this.scopes.find(s => s.namespace === namespace)

    if (scope == null) {
      throw new Error(`No scope found for namespace "${namespace}"`)
    }

    if (!this.authorizedNamespaces.includes(namespace)) {
      return
    }

    this.write(message, scope)
  }

  private write(message: string, scope: ILoggerScope): void {
    const [previousWriteTime, currentWriteTime] = this.checkScopeTimes(scope)

    const prefix = `\x1b[${scope.color}m${scope.namespace}\x1b[0m`
    const suffix = `\x1b[${scope.color}m${this.computeHumanTime(previousWriteTime, currentWriteTime)}\x1b[0m`

    const lines = message
      .split('\n')
      .map(line => line.trim())
      .filter(line => line != null && line !== '')

    for (const line of lines) {
      this.output.write(`${prefix}  ${format(line)} ${suffix}\n`)
    }
  }

  private checkScopeTimes(scope: ILoggerScope): [number, number] {
    const currentWrite = Date.now()
    const { lastWrite = currentWrite } = scope

    scope.lastWrite = currentWrite
    this.scopes = [...this.scopes.filter(s => s.namespace !== scope.namespace), scope]

    return [lastWrite, currentWrite]
  }

  private computeHumanTime(timestempA: number, timestempB: number): string {
    const diff = timestempA === 0 ? 0 : timestempB - timestempA

    const days = Math.floor(diff / 86_400_000)
    const hours = Math.floor((diff % 86_400_000) / 3_600_000)
    const minutes = Math.floor(((diff % 86_400_000) % 3_600_000) / 60_000)
    const seconds = Math.floor((((diff % 86_400_000) % 3_600_000) % 60_000) / 1000)
    const milliseconds = Math.floor((((diff % 86_400_000) % 3_600_000) % 60_000) % 1000)

    let text = `+`
    if (days > 0) { text += `${days}d ` }
    if (hours > 0) { text += `${hours}h ` }
    if (minutes > 0) { text += `${minutes}m ` }
    if (seconds > 0) { text += `${seconds}s ` }
    if (milliseconds >= 0) { text += `${milliseconds}ms` }

    return text.trim()
  }

  private updateAuthorizedNamespaces() {
    const namespaces = this.scopes.map(scope => scope.namespace)

    this.authorizedNamespaces = this.filterNamespaces(this.namespaceFilters, namespaces)
  }

  private filterNamespaces(filtersString?: string, namespaces: string[] = []): string[] {
    const { env: { DEBUG = filtersString || '' } } = process

    if (DEBUG == null || DEBUG === '') return []

    const filterList = DEBUG.split(',')
    const filters = {
      exlude: filterList
        .filter(filter => filter.startsWith('-'))
        .map(filter => filter.replace(/^-/, '')),
      include: filterList.filter(filter => !filter.startsWith('-')),
    }

    return namespaces
      .filter(namespace => {
        for (const filter of filters.exlude) {
          if (namespace === filter) {
            return false
          }
        }

        return true
      })
      .filter(namespace => {
        for (const filter of filters.include) {
          if (namespace === filter) {
            return true
          }
        }

        return false
      })
  }
}

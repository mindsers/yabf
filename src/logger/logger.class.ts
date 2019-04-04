import { format } from 'util'

import { LoggerScopeFilterRule } from './logger-scope-filter-rule.class'
import { ILoggerScope } from './logger-scope.interface'

const colors = [35, 33, 37, 32, 31, 36, 34]

export class LoggerService {
  output: { write(message: string): void } = process.stderr

  private scopes: ILoggerScope[] = []
  private internalScope: ILoggerScope = { namespace: 'yabf:logger', color: 36 }
  private authorizedNamespaces: string[] = []
  private namespaceFilters: { exclude: LoggerScopeFilterRule[]; include: LoggerScopeFilterRule[] } = {
    exclude: [],
    include: [],
  }

  constructor(filtersString?: string) {
    this.parseFilters(filtersString || '')
  }

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

  private parseFilters(filtersString: string) {
    const { env: { DEBUG = filtersString || '' } } = process

    const filterList = (DEBUG == null ? [''] : DEBUG.split(','))
      .map(representation => new LoggerScopeFilterRule(representation))
    this.namespaceFilters = {
      exclude: filterList.filter(filter => filter.isExclusionRule),
      include: filterList.filter(filter => !filter.isExclusionRule),
    }
  }

  private updateAuthorizedNamespaces() {
    const namespaces = this.scopes.map(scope => scope.namespace)

    this.authorizedNamespaces = this.filterNamespaces(namespaces)
  }

  private filterNamespaces(namespaces: string[] = []): string[] {
    return namespaces
      .filter(namespace => { // exclude
        for (const filter of this.namespaceFilters.exclude) {
          if (filter.test(namespace)) {
            return false
          }
        }

        return true
      })
      .filter(namespace => { // include
        for (const filter of this.namespaceFilters.include) {
          if (filter.test(namespace)) {
            return true
          }
        }

        return false
      })
  }
}

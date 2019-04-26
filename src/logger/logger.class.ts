import { format } from 'util'

import { LogFunction } from './log-function.type'
import { ILoggerOutput } from './logger-output.interface'
import { ILoggerScope } from './logger-scope.interface'
import { ScopeFilterRuleSet } from './scope-filter-rule-set.class'

const colors = [35, 33, 37, 32, 31, 36, 34]

export class LoggerService {
  output: ILoggerOutput = process.stderr

  private scopes: ILoggerScope[] = []
  private authorizedNS: string[] = []
  private filterSet: ScopeFilterRuleSet = new ScopeFilterRuleSet()

  constructor() {
    this.filterSet.parse(process.env.DEBUG)
  }

  registerScope(namespace: string): LogFunction {
    if (/^yabf:logger/.test(namespace)) {
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

    if (!this.authorizedNS.includes(namespace)) {
      return
    }

    this.write(message, scope)
  }

  private write(message: string, scope: ILoggerScope): void {
    const [previousWriteTime, currentWriteTime] = this.getTimesForScope(scope)

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

  private getTimesForScope(scope: ILoggerScope): [number, number] {
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

  private updateAuthorizedNamespaces(): void {
    const namespaces = this.scopes.map(scope => scope.namespace)
    this.authorizedNS = this.filterSet.filter(namespaces)
  }
}

export class LoggerScopeFilterRule {
  isExclusionRule = false

  private minimumRawFilter = ''
  private hasWildcard = false

  constructor(stringRepresentation: string) {
    const trimedRepresentation = stringRepresentation.trim()

    this.hasWildcard = /\*/.test(trimedRepresentation)
    this.isExclusionRule = /^-/.test(trimedRepresentation)
    this.minimumRawFilter = trimedRepresentation
      .replace(/^-/, '')
      .replace(/:?\*.*$/, '')
  }

  [Symbol.toPrimitive](): string {
    const exclusion = `${this.isExclusionRule ? '-' : ''}`
    const scope = `${this.minimumRawFilter}`
    const wildcard = `${this.minimumRawFilter.length > 0 && this.hasWildcard ? ':' : ''}${this.hasWildcard ? '*' : ''}`

    return `${exclusion}${scope}${wildcard}`
  }

  test(namespace: string) {
    const regex = new RegExp(`^${this.minimumRawFilter}`)

    if (!regex.test(namespace)) {
      return false
    }

    const isDeeperScope = namespace
      .trim()
      .replace(this.minimumRawFilter, '')
      .length > 0

    if (!isDeeperScope) {
      return true
    }

    if (isDeeperScope && this.hasWildcard) {
      return true
    }

    return false
  }
}

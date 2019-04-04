export class LoogerScopeFilter {
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
}

import { ScopeFilterRule } from './scope-filter-rule.class'

export class ScopeFilterRuleSet {
  includingRules: ScopeFilterRule[] = []
  excludingRules: ScopeFilterRule[] = []

  parse(stringRepresentation = ''): void {
    const filterList = stringRepresentation
      .split(',')
      .map(representation => new ScopeFilterRule(representation))

    this.excludingRules = filterList.filter(filter => filter.isExclusionRule)
    this.includingRules = filterList.filter(filter => !filter.isExclusionRule)
  }

  filter(namespaces: string[] = []): string[] {
    return namespaces
      .filter(namespace => this.filterForExcludedString(namespace))
      .filter(namespace => this.filterForIncludedString(namespace))
  }

  private filterForExcludedString(namespace: string): boolean {
    for (const rule of this.excludingRules) {
      if (rule.test(namespace)) {
        return false
      }
    }

    return true
  }

  private filterForIncludedString(namespace: string): boolean {
    for (const rule of this.includingRules) {
      if (rule.test(namespace)) {
        return true
      }
    }

    return false
  }
}

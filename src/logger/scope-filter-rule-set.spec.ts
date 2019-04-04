// tslint:disable-next-line:no-implicit-dependencies
import test from 'ava'

import { ScopeFilterRuleSet } from './scope-filter-rule-set.class'

const namespaces = [
  'express',
  'express:http',
  'yabf:router',
  'yabf:router',
  'express:http',
  'yabf:injector',
  'express:http',
  'express',
  'regex:test',
  'express:http',
  'yabf:application',
  'yabf:injector:part',
  'yabf:injector',
  'express:http',
  'yabf:injector',
  'yabf:application',
  'yabf',
]

test('filter should return "yabf:injector" occurences if rules equal "yabf:injector"', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('yabf:injector')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 3)
})

test('filter should return "yabf:injector" occurences if rules equal "yabf:injector,express:*"', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('yabf:injector,express:*')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 3)
})

test('filter should return "yabf:injector" occurences if rules equal "yabf:*,express:*"', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('yabf:*,express:*')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 3)
})

test('filter should return "yabf:injector" occurences if rules equal "*"', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('*')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 3)
})

test('filter should return "yabf:injector" occurences if rules equal "*,-express"', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('*,-express')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 3)
})

test('filter should return "yabf:injector" occurences if rules equal "yabf:injector:*,-express"', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('yabf:injector:*,-express')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 3)
})

test('filter should return "yabf:injector" occurences if rules equal "*,-yabf"', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('*,-yabf')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 3)
})

test('filter should not return "yabf:injector" occurences if rules equal "*,-yabf:*"', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('*,-yabf:*')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 0)
})

test('filter should not return "yabf:injector" occurences if rules equal "*,-yabf:injector"', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('*,-yabf:injector')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 0)
})

test('filter should not return "yabf:injector" occurences if rules equal "*,-yabf:injector:*"', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('*,-yabf:injector:*')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 0)
})

test('filter should not return "yabf:injector" occurences if rules equal "yabf:*,-yabf:injector"', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('yabf:*,-yabf:injector')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 0)
})

test('filter should not return "yabf:injector" occurences if rules equal "yabf:application:*', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('yabf:application:*')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 0)
})

test('filter should not return "yabf:injector" occurences if rules equal "yabf:application,yabf:router', t => {
  const filterSet = new ScopeFilterRuleSet()
  filterSet.parse('yabf:application,yabf:router')

  const a = filterSet
    .filter(namespaces)
    .filter(el => el === 'yabf:injector')
    .length

  t.is(a, 0)
})

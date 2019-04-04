// tslint:disable-next-line:no-implicit-dependencies
import test from 'ava'

import { LoggerScopeFilterRule } from './logger-scope-filter-rule.class'

test('LoggerScopeFilter should understand correctly a string representation of this filter', t => {
  const filter1 = new LoggerScopeFilterRule('yabf:injector')
  const filter2 = new LoggerScopeFilterRule('yabf:router:*')
  const filter3 = new LoggerScopeFilterRule('-yabf:router')
  const filter4 = new LoggerScopeFilterRule('-yabf:*')
  const filter5 = new LoggerScopeFilterRule('-yabf:*:build')
  const filter6 = new LoggerScopeFilterRule('*')

  t.is(`${filter1}`, 'yabf:injector')
  t.is(`${filter2}`, 'yabf:router:*')
  t.is(`${filter3}`, '-yabf:router')
  t.is(`${filter4}`, '-yabf:*')
  t.is(`${filter5}`, '-yabf:*')
  t.is(`${filter6}`, '*')
})

test.only('test should successfully filter when rule is "yabf:injector"', t => {
  const filter = new LoggerScopeFilterRule('yabf:injector')
  const goodScope = [
    'yabf:injector',
  ]
  const badScope = [
    'yabf:router',
    'express',
    'regex:test',
    'yabf:router:http',
    'yabf:injector:part',
    'express:http',
    'yabf:application',
    'yabf',
  ]

  for (const scope of goodScope) {
    t.true(filter.test(scope))
  }

  for (const scope of badScope) {
    t.false(filter.test(scope))
  }
})

test.only('test should successfully filter when rule is "yabf:router:*"', t => {
  const filter = new LoggerScopeFilterRule('yabf:router:*')
  const goodScope = [
    'yabf:router',
    'yabf:router:http',
  ]
  const badScope = [
    'yabf:injector',
    'express',
    'regex:test',
    'express:http',
    'yabf:application',
    'yabf',
  ]

  for (const scope of goodScope) {
    t.true(filter.test(scope))
  }

  for (const scope of badScope) {
    t.false(filter.test(scope))
  }
})

test.only('test should successfully filter when rule is "-yabf:router"', t => {
  const filter = new LoggerScopeFilterRule('-yabf:router')
  const goodScope = [
    'yabf:router',
  ]
  const badScope = [
    'yabf:router:http',
    'yabf:injector',
    'express',
    'regex:test',
    'express:http',
    'yabf:application',
    'yabf',
  ]

  for (const scope of goodScope) {
    t.true(filter.test(scope))
  }

  for (const scope of badScope) {
    t.false(filter.test(scope))
  }
})

test.only('test should successfully filter when rule is "-yabf:*"', t => {
  const filter = new LoggerScopeFilterRule('-yabf:*')
  const goodScope = [
    'yabf:router',
    'yabf:injector',
    'yabf:router:http',
    'yabf:application',
    'yabf',
  ]
  const badScope = [
    'express',
    'regex:test',
    'express:http',
  ]

  for (const scope of goodScope) {
    t.true(filter.test(scope))
  }

  for (const scope of badScope) {
    t.false(filter.test(scope))
  }
})

test.only('test should successfully filter when rule is "*"', t => {
  const filter = new LoggerScopeFilterRule('*')
  const goodScope = [
    'yabf:router',
    'express:http',
    'yabf:injector',
    'regex:test',
    'yabf:router:http',
    'yabf:application',
    'express',
    'yabf',
  ]

  for (const scope of goodScope) {
    t.true(filter.test(scope))
  }
})

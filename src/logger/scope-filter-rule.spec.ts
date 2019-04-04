// tslint:disable-next-line:no-implicit-dependencies
import test from 'ava'

import { ScopeFilterRule } from './scope-filter-rule.class'

test('LoggerScopeFilter should understand correctly a string representation of this filter', t => {
  const filter1 = new ScopeFilterRule('yabf:injector')
  const filter2 = new ScopeFilterRule('yabf:router:*')
  const filter3 = new ScopeFilterRule('-yabf:router')
  const filter4 = new ScopeFilterRule('-yabf:*')
  const filter5 = new ScopeFilterRule('-yabf:*:build')
  const filter6 = new ScopeFilterRule('*')

  t.is(`${filter1}`, 'yabf:injector')
  t.is(`${filter2}`, 'yabf:router:*')
  t.is(`${filter3}`, '-yabf:router')
  t.is(`${filter4}`, '-yabf:*')
  t.is(`${filter5}`, '-yabf:*')
  t.is(`${filter6}`, '*')
})

test('test should successfully filter when rule is "yabf:injector"', t => {
  const filter = new ScopeFilterRule('yabf:injector')
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

test('test should successfully filter when rule is "yabf:router:*"', t => {
  const filter = new ScopeFilterRule('yabf:router:*')
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

test('test should successfully filter when rule is "-yabf:router"', t => {
  const filter = new ScopeFilterRule('-yabf:router')
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

test('test should successfully filter when rule is "-yabf:*"', t => {
  const filter = new ScopeFilterRule('-yabf:*')
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

test('test should successfully filter when rule is "*"', t => {
  const filter = new ScopeFilterRule('*')
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

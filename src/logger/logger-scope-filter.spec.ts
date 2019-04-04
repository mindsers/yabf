// tslint:disable-next-line:no-implicit-dependencies
import test from 'ava'

import { LoogerScopeFilter } from './logger-scope-filter.class'

test('LoggerScopeFilter should understand correctly a string representation of this filter', t => {
  const filter1 = new LoogerScopeFilter('yabf:logger')
  const filter2 = new LoogerScopeFilter('yabf:router:*')
  const filter3 = new LoogerScopeFilter('-yabf:router')
  const filter4 = new LoogerScopeFilter('-yabf:*')
  const filter5 = new LoogerScopeFilter('-yabf:*:build')
  const filter6 = new LoogerScopeFilter('*')

  t.is(`${filter1}`, 'yabf:logger')
  t.is(`${filter2}`, 'yabf:router:*')
  t.is(`${filter3}`, '-yabf:router')
  t.is(`${filter4}`, '-yabf:*')
  t.is(`${filter5}`, '-yabf:*')
  t.is(`${filter6}`, '*')
})

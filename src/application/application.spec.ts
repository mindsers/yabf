// tslint:disable-next-line:no-implicit-dependencies
import test from 'ava'

import { InjectorService } from '../injector/injector.class'
import { RouterService } from '../router/router.class'

import { Application } from './application.class'

test('starting', t => {
  t.notThrows(() => {
    const app = new Application({} as InjectorService, {} as RouterService)
  })
})

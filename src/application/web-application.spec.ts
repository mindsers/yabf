// tslint:disable-next-line:no-implicit-dependencies
import test from 'ava'

import { InjectorService } from '../injector/injector.class'
import { LoggerService } from '../logger/logger.class'
import { RouterService } from '../router/router.class'

import { WebApplication } from './web-application.class'

test('starting', t => {
  t.notThrows(() => {
    const app = new WebApplication(
      {} as InjectorService,
      {} as RouterService,
      { registerScope: (scope: string) => { /**/ } } as LoggerService,
    )
  })
})

import test from 'ava'
import { Application, InjectorService, RouterService } from '.';

test('starting', t => {
  t.notThrows(() => {
    const app = new Application({} as InjectorService, {} as RouterService)
  })
})

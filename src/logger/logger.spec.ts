// tslint:disable-next-line:no-implicit-dependencies
import test from 'ava'

import { LoggerService } from '../logger/logger.class'

test('registerScope should return a log function', t => {
  const service = new LoggerService()
  const log = service.registerScope('a')

  t.true(typeof log === 'function')
})

test('log should fail if the scope isn\'t registered before', t => {
  const service = new LoggerService()

  t.throws(() => service.log('a', 'test'))
})

test('registerScope should throw an error if trying to register "yabf:logger"', t => {
  const service = new LoggerService()

  t.throws(() => service.registerScope('yabf:logger'))
})

test('registerScope should throw an error if trying to register a sub namespace of "yabf:logger"', t => {
  const service = new LoggerService()

  t.throws(() => service.registerScope('yabf:logger:bunyan'))
})

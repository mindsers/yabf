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

test('log should call output', t => {
  const service = new LoggerService()
  service.registerScope('a')

  let count = 0
  service.output = {
    write(_message: string) {
      count += 1
    },
  }

  service.log('a', 'test')

  t.true(count > 0)
})

test('log function returned by registerScope should call output', t => {
  const service = new LoggerService()
  const log = service.registerScope('a')

  let count = 0
  service.output = {
    write(_message: string) {
      count += 1
    },
  }

  log('test')

  t.true(count > 0)
})

test('log should write several line instead of using "\\n"', t => {
  const service = new LoggerService()
  const log = service.registerScope('a')

  let count = 0
  service.output = {
    write(_message: string) {
      count += 1
    },
  }

  log('test\ntest 1\ntest 2\ntest 3\n')

  t.true(count === 4)
})

test.cb('log should add the time passed since last log call', t => {
  const service = new LoggerService()
  const log = service.registerScope('a')

  service.output = {
    write(message: string) {
      t.true(/\+[0-9]+ms/.test(message))
    },
  }

  log('test')

  setTimeout(_ => {
    log('test')
    t.end()
  }, 80)
})

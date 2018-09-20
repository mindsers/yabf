// tslint:disable-next-line:no-implicit-dependencies
import test from 'ava'

import { AbstractApplication } from './abstract-application.class'
import { MissingBuildInstruction } from './missing-build-instruction-error.class'

class A extends AbstractApplication {
  start(): void {
    throw new Error('Method not implemented.')
  }

  protected buildInstructions() {
    return [{ provide: A, dependencies: [] }]
  }
}

test('createInstance should not throw errors', t => {
  t.notThrows(() => {
    A.createInstance<A>()
  })
})

test('createInstance should create an instance of A', t => {
  const a = A.createInstance<A>()
  t.true(a instanceof A)
  t.true(a instanceof AbstractApplication)
})

test('createInstance should throw an error when no buildInstruction are given', t => {
  // tslint:disable-next-line:max-classes-per-file
  class B extends AbstractApplication {
    start(): void { /**/ }
    protected buildInstructions() { return [] }
  }

  t.throws(() => {
    B.createInstance<B>()
  }, MissingBuildInstruction)
})

'use strict'

import { isObject, isUndefined } from 'lodash'
import { deepEqual, equal, ok } from 'assert'
import P from 'bluebird'
import EventEmitter from 'events'
import e2p from '../src'

const assert = (actual, expected, message) => {
  if (isUndefined(message)) {
    message = expected
    return ok(actual, message)
  }

  return isObject(actual) && isObject(expected)
    ? deepEqual(actual, expected, message)
    : equal(actual, expected, message)
}

describe('e2p', () => {
  it('resolve - async', () => {
    const test = new EventEmitter()
    const done = e2p(test, 'done')
    setImmediate(() => test.emit('done'))
    return done
  })

  it('resolve - sync', () => {
    const test = new EventEmitter()
    const done = e2p(test, 'done')
    test.emit('done')
    return done
  })

  it('resolve - element', () => {
    const test = new EventEmitter()
    const done = e2p(test, 'done')
    const res = '123'
    test.emit('done', res)
    return done.then(_res => assert(_res, res, 'res must be equal'))
  })

  it('resolve - array (then)', () => {
    const test = new EventEmitter()
    const done = e2p(test, 'done')
    const res = [1, 2, 3]
    test.emit('done', ...res)
    return done.then(_res => assert(_res, res, 'res must be equal'))
  })

  it('resolve - array (catch)', () => {
    const test = new EventEmitter()
    const done = e2p(test, 'done')
    const res = [1, 2, 3]
    test.emit('done', ...res)
    return done.then(([ arg0, arg1, arg2 ]) => {
      assert(arg0, res[0], 'arg0 must be equal')
      assert(arg1, res[1], 'arg1 must be equal')
      assert(arg2, res[2], 'arg2 must be equal')
    })
  })

  it('reject - async', () => {
    const test = new EventEmitter()
    const done = e2p(test, '_', 'error')
    const err = new Error('123')
    setImmediate(() => test.emit('error', err))
    return done.then(
      () => P.reject(new Error('error was emited!')),
      () => P.resolve('error was catched!'))
  })

  it('reject - sync', () => {
    const test = new EventEmitter()
    const done = e2p(test, '_', 'error')
    const err = new Error('123')
    test.emit('error', err)
    return done.then(
      () => P.reject(new Error('error was emited!')),
      () => P.resolve('error was catched!'))
  })

  it('reject - element', () => {
    const test = new EventEmitter()
    const done = e2p(test, '_', 'error')
    const err = new Error('123')
    test.emit('error', err)
    return done.then(
      () => P.reject(new Error('error was emited!')),
      _err => assert(_err, err, 'err must be equal'))
  })

  it('reject - array', () => {
    const test = new EventEmitter()
    const done = e2p(test, '_', 'error')
    const err = [new Error('1'), new Error('2'), new Error('3')]
    test.emit('error', ...err)
    return done.then(
      () => P.reject(new Error('error was emited!')),
      _err => assert(_err, err, 'err must be equal'))
  })
})

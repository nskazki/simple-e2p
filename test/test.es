'use strict'

import { isObject, isUndefined } from 'lodash'
import { deepEqual, equal, ok } from 'assert'
import P from 'bluebird'
import EventEmitter from 'events'
import e2p from '../src'

let assert = (actual, expected, message) => {
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
    let test = new EventEmitter()
    let done = e2p(test, 'done')
    setImmediate(() => test.emit('done'))
    return done
  })

  it('resolve - sync', () => {
    let test = new EventEmitter()
    let done = e2p(test, 'done')
    test.emit('done')
    return done
  })

  it('resolve - element', () => {
    let test = new EventEmitter()
    let done = e2p(test, 'done')
    let res = '123'
    test.emit('done', res)
    return done.then(_res => assert(_res, res, 'res must be equal'))
  })

  it('resolve - array', () => {
    let test = new EventEmitter()
    let done = e2p(test, 'done')
    let res = [ 1, 2, 3 ]
    test.emit.apply(test, [ 'done', ...res ])
    return done.then(_res => assert(_res, res, 'res must be equal'))
  })

  it('reject - async', () => {
    let test = new EventEmitter()
    let done = e2p(test, '_', 'error')
    let err = new Error('123')
    setImmediate(() => test.emit('error', err))
    return done.then(
      () => P.reject(new Error('error was emited!')),
      () => P.resolve('error was catched!'))
  })

  it('reject - sync', () => {
    let test = new EventEmitter()
    let done = e2p(test, '_', 'error')
    let err = new Error('123')
    test.emit('error', err)
    return done.then(
      () => P.reject(new Error('error was emited!')),
      () => P.resolve('error was catched!'))
  })

  it('reject - element', () => {
    let test = new EventEmitter()
    let done = e2p(test, '_', 'error')
    let err = new Error('123')
    test.emit('error', err)
    return done.then(
      () => P.reject(new Error('error was emited!')),
      _err => assert(_err, err, 'err must be equal'))
  })

  it('reject - array', () => {
    let test = new EventEmitter()
    let done = e2p(test, '_', 'error')
    let err = [ new Error('1'), new Error('2'), new Error('3') ]
    test.emit.apply(test, [ 'error', ...err ])
    return done.then(
      () => P.reject(new Error('error was emited!')),
      _err => assert(_err, err, 'err must be equal'))
  })
})

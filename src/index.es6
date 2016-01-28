'use strict'

import { isUndefined, omit, toArray } from 'lodash'
import P from 'bluebird'
import rawe2p from 'event-to-promise'

export default function e2p(obj, res, rej) {
  let p = (rawe2p(obj, res, isUndefined(rej)
    ? { array: true, ignoreErrors: true }
    : { array: true, error: rej }))
  return p.then(
    res => P.resolve(extr(res)),
    err =>  P.reject(extr(err)))
}

function extr(res) {
  return res.length <= 1
    ? res[0]
    : toArray(omit(res, 'event'))
}

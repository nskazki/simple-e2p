# simple-e2p

A way to turn a one-time event into a promise

```
yarn add simple-e2p
```

## Example

```js
import e2p from 'simple-e2p'
import EventEmitter from 'events'

const test = new EventEmitter()
e2p(test, 'event').then(console.log)
test.emit('event', { foo: 'bar' })
/*
  { foo: 'bar' }
*/
```

```js
import e2p from 'simple-e2p'
import EventEmitter from 'events'

const test = new EventEmitter()
e2p(test, '_', 'error').catch(console.log)
test.emit('error', { foo: 'bar' }, { abs: 123 })
/*
  [{ foo: 'bar' }, { abs: 123 }]
*/
```

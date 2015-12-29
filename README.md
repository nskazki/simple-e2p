# simple-e2p

```
npm i -S simple-e2p
```

### Example

```js
import e2p from 'simple-e2p'

var test = new EventEmitter()
e2p(test, 'event').then(console.log)
test.emit('event', { foo: 'bar' })
/*
    { foo: 'bar' }
*/
```

```js
import e2p from 'simple-e2p'

var test = new EventEmitter()
e2p(test, '_', 'error').catch(console.log)
test.emit('error', { foo: 'bar' }, { abs: 123 })
/*
    [ { foo: 'bar' }, { abs: 123 } ]
*/
```

For more examples see `/test` folder

// @flow
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/do'

import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'

const x = Observable.of(1, 2, 3)
  .filter(x => x % 2 === 0)
  .map(x => ({ name: x + '!!!' }))

x.subscribe(x => {
  console.log(x.name)
})

type Action =
  | { type: 'INCREMENT' }
  | { type: 'INCREMENT_ASYNC' }
  | { type: 'DECREMENT' }

function counter(state = 0, action: Action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

type AO = Observable<Action>

const epic = (actoin$: AO): AO =>
  actoin$
    .filter(action => action.type === 'INCREMENT_ASYNC')
    .do(v => console.log(v))
    .delay(1000)
    .mapTo({ type: 'INCREMENT' })

const epicMiddleware = createEpicMiddleware(epic)

let store = createStore(counter, applyMiddleware(epicMiddleware))

store.subscribe(() => console.log(store.getState()))

store.dispatch({ type: 'INCREMENT_ASYNC' })
store.dispatch({ type: 'INCREMENT_ASYNC' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT_ASYNC' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'DECREMENT' })

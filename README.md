# redux-threads

Helpers for reusable combinations of selectors, actions and reducers in redux.

## Installation

```
npm install redux-threads
```

## Usage

### `makeConnectArgs`

A "thread" is an array of the form:
[selectors, action creators, prop mergers function].

`makeConnectArgs` takes any number of threads as args, and returns
an array that can then be spread as args into
[react-redux connect](https://react-redux.js.org/api/connect#connect)

```js
import { connect } from 'react-redux';
import { makeConnectArgs } from 'redux-threads';

// selectors & action creators imported here
// component to connect imported here

const thread1 = [
  {
    selector1,
    selector2,
  },
  {
    actionCreator1,
    actionCreator2,
  },
  (stateProps, dispatchProps) => ({
    compositeProp: dispatchProps.actionCreator1.bind(
      null,
      stateProps.selector1,
    ),
  }),
];

const thread2 = [
  {
    selector3,
    selector4,
  },
  {
    actionCreator3,
    actionCreator4,
  },
  // prop merger function is not required
];

const connectArgs = makeConnectArgs(thread1, thread2);

export default connect(...connectArgs)(ComponentToBeConnected);

```

This is useful for passing collections of selectors and action creators
into multiple connected components.

### `createConstants`

Given an array of constant strings, returns an object
where keys equal values for the string and async suffixed variants (`_START`,
`_COMPLETED`, `_FAILED`).

```js

import { createConstants } from 'redux-threads';

export default createConstants([
  'AN_ACTION_TYPE',
]);

/* default export is:

{
  AN_ACTION_TYPE: 'AN_ACTION_TYPE',
  AN_ACTION_TYPE_START: 'AN_ACTION_TYPE_START',
  AN_ACTION_TYPE_COMPLETED: 'AN_ACTION_TYPE_COMPLETED',
  AN_ACTION_TYPE_FAILED: 'AN_ACTION_TYPE_FAILED',
}

*/
```

These constants can then be used as action types, which are especially useful for use
with [`redux-token-api-middleware`](https://github.com/eadmundo/redux-token-api-middleware).

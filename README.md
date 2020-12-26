# @berish/stateful-react-connect

ReactJS connector for @berish/stateful state managment

## Installation

```
$ npm install @berish/stateful-react-connect --save
```

or

```
$ yarn add @berish/stateful-react-connect
```

**Supports typescript**

# Usage

```typescript
import * as React from 'react';
import { createStateful } from '@berish/stateful';
import { connect } from '@berish/stateful-react-connect';

const store = createStateful({ count: 0, name: 'Ravil' });

function _ViewCountComponent(props: { prop: string }) {
  return (
    <div>
      {props.prop}: {store[props.prop]}
    </div>
  );
}

const ViewCountComponent = connect([hub])(_ViewCountComponent); // === const ViewCountComponent = connect([hub], _ViewCountComponent);

export function TestComponent() {
  return (
    <>
      <ViewCountComponent prop="count" />
      <ViewCountComponent prop="name" />
      <button onClick={() => store.count++}>Plus one</button>
      <button onClick={() => (store.name = `${store.name}${store.count}`)}>Change name</button>
    </>
  );
}
```

import * as React from 'react';
import { useEffect, useRef, useReducer } from 'react';
import { StatefulObject, IReaction, reaction } from '@berish/stateful';

function useForceUpdate() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  return forceUpdate;
}

export function functionConnector<T>(
  stores: StatefulObject<object>[],
  Component: React.FunctionComponent<T>,
): React.FunctionComponent<T> {
  return function (props: React.PropsWithChildren<T>, context: any): React.ReactElement {
    const forceUpdate = useForceUpdate();
    const reactionRef = useRef<IReaction<React.ReactElement>>();

    useEffect(() => {
      return () => {
        if (reactionRef.current) {
          reactionRef.current.revoke();
          reactionRef.current = void 0;
        }
      };
    }, []);

    if (!reactionRef.current) {
      let rendered: React.ReactElement = null;
      reactionRef.current = reaction(
        stores,
        () => (rendered = Component && Component(props, context)),
        () => forceUpdate(),
      );
      return rendered;
    }
    return reactionRef.current.result();
  };
}

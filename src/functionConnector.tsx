import * as React from 'react';
import { useEffect } from 'react';
import { StatefulObject, reaction } from '@berish/stateful';

export function functionConnector<T>(
  stores: StatefulObject<object>[],
  Component: React.FunctionComponent<T>,
): React.FunctionComponent<T> {
  return function (props: React.PropsWithChildren<T>, context: any): React.ReactElement {
    const [render, setRender] = React.useState(<React.Fragment />);

    const renderFunction = React.useCallback(() => Component && Component(props, context), [props, context]);

    useEffect(() => {
      let reactionObj = reaction(
        stores,
        () => {
          const result = renderFunction();
          setRender(result);
          return result;
        },
        () => {},
      );
      return () => {
        reactionObj.revoke();
        reactionObj = void 0;
      };
    }, [renderFunction]);
    return render;
  };
}

import * as React from 'react';
import guid from 'berish-guid';
import LINQ from '@berish/linq';
import { StatefulObject, getScope } from '@berish/stateful';

function useForceUpdate() {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  return forceUpdate;
}

export function functionConnector<T>(
  stores: StatefulObject<object>[],
  Component: React.FunctionComponent<T>,
): React.FunctionComponent<T> {
  const scopes = stores && stores.map((store) => getScope(store)).filter(Boolean);
  if (!scopes || scopes.length < 0) throw new TypeError('Need add stateful store in reaction. Current empty.');

  return function (props: React.PropsWithChildren<T>, context: any): React.ReactElement {
    const reactionId = React.useMemo(() => guid.guid(), []);
    const forceUpdate = useForceUpdate();

    const propsModel = React.useMemo<(string | number | symbol)[][][]>(() => scopes.map(() => []), []);

    scopes.forEach((scope, index) => {
      React.useEffect(() => {
        const listenId = scope.listenChange((props) => {
          const propsModelIndex = LINQ.from(propsModel[index]);
          if (propsModelIndex.some((m) => LINQ.from(m).equalsValues(props))) forceUpdate();
        });

        return () => {
          scope.unlistenChange(listenId);
        };
      }, []);
    });

    scopes.forEach((scope, index) => {
      propsModel[index] = [];
      scope.cleanRecord(reactionId);
      scope.startRecord(reactionId);
    });

    const result = Component && Component(props, context);

    scopes.forEach((scope, index) => {
      scope.stopRecord(reactionId);
      propsModel[index] = scope.getRecordProps(reactionId);
    });

    return result as any;
  };
}

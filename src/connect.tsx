import * as React from 'react';
import { isExtends } from '@berish/class';
import { StatefulObject } from '@berish/stateful';
import { classConnector } from './classConnector';
import { functionConnector } from './functionConnector';

type ClassConnectorType = <TComponent extends new (...args: any[]) => React.Component>(
  component: TComponent,
) => TComponent;
type FunctionConnectorType = <Props>(component: React.FunctionComponent<Props>) => React.FunctionComponent<Props>;

export function connect(stores: StatefulObject<object>[]): ClassConnectorType & FunctionConnectorType;
export function connect<TComponent extends new (...args: any[]) => React.Component>(
  stores: StatefulObject<object>[],
  component: TComponent,
): TComponent;
export function connect<Props>(
  stores: StatefulObject<object>[],
  component: React.FunctionComponent<Props>,
): React.FunctionComponent<Props>;
export function connect<TComponent extends new (...args: any[]) => React.Component, Props>(
  stores: StatefulObject<object>[],
  component?: TComponent | React.FunctionComponent<Props>,
) {
  if (!component)
    return (component: React.FunctionComponent | (new (...args: any[]) => React.Component)) => {
      if (isExtends(component, React.Component)) return classConnector(stores, component as TComponent);
      return functionConnector(stores, component as React.FunctionComponent<Props>);
    };
  if (isExtends(component, React.Component)) return classConnector(stores, component as TComponent);
  return functionConnector(stores, component as React.FunctionComponent<Props>);
}

import * as React from 'react';
import { StatefulObject, Reaction, reaction } from '@berish/stateful';

const SYMBOL_REACTION = Symbol('reaction');

export function classConnector<TComponent extends new (...args: any[]) => React.Component>(
  stores: StatefulObject<object>[],
  component: TComponent,
) {
  const cls: TComponent = class extends component {
    private [SYMBOL_REACTION]: Reaction<React.ReactNode> = null;

    constructor(...args) {
      super(...args);
      this.componentWillUnmount = this.componentWillUnmount.bind(this);
      this.render = this.render.bind(this);
    }

    componentWillUnmount() {
      if (this[SYMBOL_REACTION]) {
        this[SYMBOL_REACTION].revoke();
        this[SYMBOL_REACTION] = void 0;
      }
      if (super.componentWillUnmount) super.componentWillUnmount();
    }

    render() {
      if (!this[SYMBOL_REACTION]) {
        let rendered: React.ReactNode = null;
        this[SYMBOL_REACTION] = reaction(
          stores,
          () => (rendered = super.render && super.render()),
          () => this.forceUpdate(),
        );
        return rendered;
      }
      return this[SYMBOL_REACTION].result();
    }
  };
  return cls;
}

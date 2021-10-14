import { get, set } from 'lodash';

export class Scope {
  private _scope = {};
  constructor(scope: { [key: string]: any }) {
    Object.assign(this._scope, scope);
  }

  get(key: string) {
    return get(this._scope, key, null);
  }

  set<V>(key: string, value: V) {
    if (this._scope[key]) {
      console.warn('OVERRIDE ATTEMPT', key, this._scope[key], value);
    }
    set(this._scope, key, value);
  }
}

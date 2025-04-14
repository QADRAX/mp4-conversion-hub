import { Draft, produce } from "immer";
import { createObservable, Observable, Observer } from "./observable";

export interface StateContainer<T> {
  get: () => Readonly<T>;
  update: (updater: (draft: Draft<T>) => void) => void;
  subscribe: (observer: Observer<Readonly<T>>) => () => void;
}

export function createStateContainer<T>(initialState: T): StateContainer<T> {
  let state: Readonly<T> = Object.freeze(initialState);
  const observable: Observable<Readonly<T>> = createObservable<Readonly<T>>();

  const subscribe = (observer: Observer<Readonly<T>>) => {
    observable.subscribe(observer);
    return () => observable.unsubscribe(observer);
  };

  return {
    get: () => state,
    update: (updater: (draft: Draft<T>) => void) => {
      state = produce(state, updater);
      observable.notify(state);
    },
    subscribe,
  };
}

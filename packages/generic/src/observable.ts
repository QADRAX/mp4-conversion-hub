export type Subcribible<T> = {
  subscribe: (observer: Observer<T>) => void;
  unsubscribe: (observer: Observer<T>) => void;
}

export type Notificable<T> = {
  notify: (state: T) => void;
}

export type Observable<T> = Subcribible<T> & Notificable<T>;

export type Observer<T> = (state: T) => void;

export function createObservable<T>(): Observable<T> {
  let observers: Observer<T>[] = [];
  let lastState: T | null = null;

  return {
    subscribe(observer: Observer<T>) {
      observers = [...observers, observer];
    },
    unsubscribe(observer: Observer<T>) {
      observers = observers.filter((obs) => obs !== observer);
    },
    notify(state: T) {
      lastState = state;
      observers.forEach((observer) => observer(state));
    }
  };
}

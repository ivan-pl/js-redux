interface IAction {
  type: string;
  payload?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

type TState = { [key: string]: any };

type TSubscriber = (state: TState) => void;

interface IStore {
  dispatch(action: IAction): void;
  getState(): TState;
  subscribe(cb: TSubscriber): () => void;
  replaceReducer(reducer: TReducer): void;
}

export type TReducer = (state: TState, action: IAction) => TState;

export function createStore(
  reducer: TReducer,
  initialState: TState = {}
): IStore {
  let state = initialState;
  const subscribers: Set<TSubscriber> = new Set();

  return {
    dispatch(action) {
      const newState = reducer(state, action);
      state = newState;
      subscribers.forEach((subscriber) => subscriber(newState));
    },

    getState() {
      return state;
    },

    subscribe(subscriber) {
      subscribers.add(subscriber);
      return () => {
        subscribers.delete(subscriber);
      };
    },

    replaceReducer(newReducer) {
      reducer = newReducer;
    },
  };
}

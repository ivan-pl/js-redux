export interface IAction {
  type: string;
  payload?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

type TState = { [key: string]: any };

type TSubscriber = (state: TState) => void;

interface IStore {
  dispatch(action: IAction): IAction;
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
      return action;
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

type TCombineReducers<ReducersConfig = any, Action = { type: any }> = (config: {
  [key in keyof ReducersConfig]: (
    state: ReducersConfig[key] | undefined,
    action: Action
  ) => ReducersConfig[key];
}) => (
  state:
    | {
        [key in keyof ReducersConfig]: ReducersConfig[key];
      }
    | undefined,
  action: Action
) => {
  [key in keyof ReducersConfig]: ReducersConfig[key];
};

export const combineReducers: TCombineReducers = (config) => {
  return (state, action) => {
    const newState = { ...state };
    for (const [key, reducer] of Object.entries(config)) {
      newState[key] = reducer(newState[key], action);
    }
    return newState;
  };
};

export type TMiddleware = (
  store: IStore
) => (next: IStore["dispatch"]) => (action: IAction) => IAction;

export function applyMiddleware(
  store: IStore,
  middlewares: TMiddleware[]
): IStore {
  middlewares = middlewares.slice();
  middlewares.reverse();
  let dispatch = store.dispatch;

  middlewares.forEach((middleware) => (dispatch = middleware(store)(dispatch)));
  return Object.assign({}, store, { dispatch });
}

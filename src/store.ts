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
}

export type TReducer<State> = (state: State, action: IAction) => State;

export function createStore(
  reducer: TReducer<TState>,
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

    subscribe(subscriber: TSubscriber) {
      subscribers.add(subscriber);
      return () => {
        subscribers.delete(subscriber);
      };
    },
  };
}

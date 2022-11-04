interface IStore<
  State = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Action extends { type: string; payload?: any } = { type: string } // eslint-disable-line @typescript-eslint/no-explicit-any
> {
  dispatch(action: Action): void;
  getState(): State;
  subscribe(cb: (state: State) => void): () => void;
}

type Reducer<State, Action> = (state: State, action: Action) => Action;

export function createStore<State, Action>(
  reducer: Reducer<State, Action>,
  initialState: State
): IStore {
  const state = initialState;
  return {
    dispatch(action) {}, // eslint-disable-line
    getState() {
      return state;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subscribe(cb) {
      return () => {}; // eslint-disable-line
    },
  };
}

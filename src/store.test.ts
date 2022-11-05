import { createStore } from "./store";

describe("createStore", () => {
  describe("provides api", () => {
    it("is a function", () => {
      expect(createStore).toBeInstanceOf(Function);
    });

    it("has methods corresponding to store API", () => {
      const store = createStore(jest.fn());
      expect(store.dispatch).toBeInstanceOf(Function);
      expect(store.getState).toBeInstanceOf(Function);
      expect(store.subscribe).toBeInstanceOf(Function);
      expect(store.subscribe(jest.fn())).toBeInstanceOf(Function);
    });
  });

  describe("functional interface", () => {
    it("returns state based on initial state", () => {
      const state = { name: "Bob" };
      expect(createStore(jest.fn()).getState()).toEqual({});
      expect(createStore(jest.fn(), state).getState()).toBe(state);
    });

    it("calculates new state with reducer", () => {
      const action1 = { type: "x" };
      const action2 = { type: "y" };
      const reducer = jest.fn((state, action) => {
        if (action.type === action1.type) {
          return { ...state, counter: state.counter + 1 };
        }
        return state;
      });
      const initialState = { counter: 0 };

      const store = createStore(reducer, initialState);
      store.dispatch(action1);
      const newState = { counter: 1 } as const;

      expect(reducer).toHaveBeenCalledTimes(1);
      expect(reducer).toHaveBeenCalledWith(
        expect.objectContaining(initialState),
        action1
      );
      expect(store.getState()).toEqual(newState);

      store.dispatch(action2);
      expect(reducer).toHaveBeenCalledTimes(2);
      expect(reducer).toHaveBeenCalledWith(
        expect.objectContaining(newState),
        action2
      );
      expect(store.getState()).toEqual(newState);
    });

    it("notifies subscribers", () => {
      const action = { type: "x" };
      const reducer = jest.fn().mockReturnValueOnce("a").mockReturnValue("b");
      const store = createStore(reducer);
      const spy = jest.fn();
      store.subscribe(spy);

      expect(spy).toHaveBeenCalledTimes(0);
      store.dispatch(action);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("a");
      store.dispatch(action);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith("b");
    });

    it("allows to unsubscribe", () => {
      const action = { type: "x" };
      const reducer = jest.fn();
      const store = createStore(reducer);
      const spy = jest.fn();
      const unsubscribe = store.subscribe(spy);

      store.dispatch(action);
      expect(spy).toHaveBeenCalledTimes(1);
      unsubscribe();
      store.dispatch(action);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("allows to replace reducer", () => {
      const action = { type: "x" };
      const initialReducer = jest.fn();
      const newReducer = jest.fn();
      const store = createStore(initialReducer);

      store.dispatch(action);
      expect(initialReducer).toHaveBeenCalledTimes(1);
      expect(newReducer).not.toHaveBeenCalled();

      store.replaceReducer(newReducer);
      store.dispatch(action);
      expect(initialReducer).toHaveBeenCalledTimes(1);
      expect(newReducer).toHaveBeenCalledTimes(1);
    });
  });
});

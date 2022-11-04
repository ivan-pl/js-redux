import { createStore } from "./store";

describe("createStore", () => {
  describe("provides api", () => {
    it("is a function", () => {
      expect(createStore).toBeInstanceOf(Function);
    });

    it("has methods corresponding to store API", () => {
      const store = createStore(jest.fn(), 0);
      expect(store.dispatch).toBeInstanceOf(Function);
      expect(store.getState).toBeInstanceOf(Function);
      expect(store.subscribe).toBeInstanceOf(Function);
      expect(store.subscribe(jest.fn())).toBeInstanceOf(Function);
    });
  });
});

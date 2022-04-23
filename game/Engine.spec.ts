import Engine, { Cell } from './Engine';

describe('Engine', () => {
  it('starts with an empty state', () => {
    const engine = new Engine(() => {}, () => {});
    const state = engine.getState();

    expect(state.length).toBe(3);

    for (const row of state) {
      expect(row.length).toBe(3);

      for (const cell of row) {
        expect(cell).toBe(Cell.Empty);
      }
    }
  });
});

import { gridFor } from "../layout";

describe("gridFor", () => {
  it("devuelve la cuadrícula esperada de 1 a 6", () => {
    expect(gridFor(1)).toMatchObject({ cols: 1, rows: 1 });
    expect(gridFor(2)).toMatchObject({ cols: 2, rows: 1 });
    expect(gridFor(3)).toMatchObject({ cols: 3, rows: 1 });
    expect(gridFor(4)).toMatchObject({ cols: 2, rows: 2 });
    expect(gridFor(5)).toMatchObject({ cols: 3, rows: 2 });
    expect(gridFor(6)).toMatchObject({ cols: 3, rows: 2 });
  });
  it("9 huecos → 3×3", () => {
    expect(gridFor(9)).toMatchObject({ cols: 3, rows: 3 });
    expect(gridFor(9).slots).toHaveLength(9);
  });
  it("slots contiene 1…n", () => {
    expect(gridFor(4).slots).toEqual([1, 2, 3, 4]);
  });
});

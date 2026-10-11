import type { FaceLayout } from "./types";

const GRIDS: Record<number, { cols: number; rows: number }> = {
  1: { cols: 1, rows: 1 },
  2: { cols: 2, rows: 1 },
  3: { cols: 3, rows: 1 },
  4: { cols: 2, rows: 2 },
  5: { cols: 3, rows: 2 },
  6: { cols: 3, rows: 2 },
  7: { cols: 3, rows: 3 },
  8: { cols: 3, rows: 3 },
  9: { cols: 3, rows: 3 },
};

/** Cuadrícula para una cara (hasta 9 huecos en 3×3; con 5 la última fila va centrada). */
export function gridFor(count: number): FaceLayout {
  const n = Math.min(9, Math.max(1, Math.round(count)));
  const { cols, rows } = GRIDS[n];
  return { cols, rows, slots: Array.from({ length: n }, (_, i) => i + 1) };
}

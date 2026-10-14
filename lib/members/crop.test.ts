import { describe, expect, it } from "vitest";
import {
  CARD_ASPECT,
  baseCrop,
  clampPan,
  clampZoom,
  sourceRect,
} from "@/lib/members/crop";

describe("crop", () => {
  it("aspect de la carta (retrato)", () => {
    expect(CARD_ASPECT).toBeCloseTo(0.718, 3);
  });

  it("baseCrop: horizontal encaja por alto", () => {
    const b = baseCrop(1600, 900);
    expect(b.h).toBe(900);
    expect(b.w).toBeCloseTo(900 * CARD_ASPECT, 6);
  });

  it("baseCrop: vertical encaja por ancho", () => {
    const b = baseCrop(600, 1200);
    expect(b.w).toBe(600);
    expect(b.h).toBeCloseTo(600 / CARD_ASPECT, 6);
  });

  it("zoom 1 centra el rectángulo base", () => {
    const r = sourceRect(1600, 900, { zoom: 1, panX: 0, panY: 0 });
    expect(r.sw).toBeCloseTo(900 * CARD_ASPECT, 6);
    expect(r.sh).toBe(900);
    expect(r.sx).toBeCloseTo((1600 - r.sw) / 2, 6);
    expect(r.sy).toBe(0);
  });

  it("zoom 2 reduce a la mitad", () => {
    const a = sourceRect(1600, 900, { zoom: 1, panX: 0, panY: 0 });
    const b = sourceRect(1600, 900, { zoom: 2, panX: 0, panY: 0 });
    expect(b.sw).toBeCloseTo(a.sw / 2, 6);
    expect(b.sh).toBeCloseTo(a.sh / 2, 6);
  });

  it("pan lleva al borde sin salirse", () => {
    const r = sourceRect(1600, 900, { zoom: 2, panX: 1, panY: -1 });
    expect(r.sx).toBeCloseTo(1600 - r.sw, 6);
    expect(r.sy).toBeCloseTo(0, 6);
  });

  it("pan fuera de rango se recorta", () => {
    const a = sourceRect(1600, 900, { zoom: 2, panX: 9, panY: -9 });
    const b = sourceRect(1600, 900, { zoom: 2, panX: 1, panY: -1 });
    expect(a).toEqual(b);
    expect(clampPan(9)).toBe(1);
    expect(clampPan(-9)).toBe(-1);
  });

  it("zoom fuera de rango se recorta", () => {
    expect(clampZoom(0.2)).toBe(1);
    expect(clampZoom(99)).toBe(3);
  });

  it("el rectángulo siempre queda dentro de la fuente", () => {
    for (const [w, h] of [[1600, 900], [600, 1200], [800, 800]] as const) {
      for (const zoom of [1, 1.5, 3]) {
        for (const panX of [-1, 0, 1]) {
          for (const panY of [-1, 0, 1]) {
            const r = sourceRect(w, h, { zoom, panX, panY });
            expect(r.sx).toBeGreaterThanOrEqual(-1e-6);
            expect(r.sy).toBeGreaterThanOrEqual(-1e-6);
            expect(r.sx + r.sw).toBeLessThanOrEqual(w + 1e-6);
            expect(r.sy + r.sh).toBeLessThanOrEqual(h + 1e-6);
          }
        }
      }
    }
  });
});

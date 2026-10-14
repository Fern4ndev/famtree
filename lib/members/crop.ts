/** Recorte elegible para la carta (retrato 0.718, igual que --card-aspect). */

export const CARD_ASPECT = 0.718;

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;

export interface CropState {
  zoom: number;
  /** -1..1: 0 centrado, ±1 pegado al borde */
  panX: number;
  /** -1..1: 0 centrado, ±1 pegado al borde */
  panY: number;
}

export interface SourceRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export function clampZoom(z: number): number {
  if (Number.isNaN(z)) return MIN_ZOOM;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));
}

export function clampPan(p: number): number {
  if (Number.isNaN(p)) return 0;
  return Math.min(1, Math.max(-1, p));
}

/** Mayor rectángulo con aspecto de carta que cabe en la fuente. */
export function baseCrop(srcW: number, srcH: number): { w: number; h: number } {
  if (srcW / srcH > CARD_ASPECT) {
    return { w: srcH * CARD_ASPECT, h: srcH };
  }
  return { w: srcW, h: srcW / CARD_ASPECT };
}

/** Rectángulo fuente a dibujar, siempre dentro de la imagen. */
export function sourceRect(
  srcW: number,
  srcH: number,
  crop: CropState
): SourceRect {
  const zoom = clampZoom(crop.zoom);
  const panX = clampPan(crop.panX);
  const panY = clampPan(crop.panY);
  const base = baseCrop(srcW, srcH);
  const sw = base.w / zoom;
  const sh = base.h / zoom;
  const cx = srcW / 2 + panX * ((srcW - sw) / 2);
  const cy = srcH / 2 + panY * ((srcH - sh) / 2);
  return { sx: cx - sw / 2, sy: cy - sh / 2, sw, sh };
}

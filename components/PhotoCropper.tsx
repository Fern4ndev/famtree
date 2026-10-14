"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { CARD_ASPECT, clampPan, clampZoom, sourceRect } from "@/lib/members/crop";

const EXPORT_W = 720;
const PAN_STEP = 0.15;

export default function PhotoCropper({
  src,
  open,
  onOpenChange,
  onApply,
}: {
  src: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (file: File) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const loadedSrc = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!src || !open) return;
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    let cancelled = false;
    img.onload = () => {
      if (cancelled) return;
      imgRef.current = img;
      if (loadedSrc.current !== src) {
        loadedSrc.current = src;
        setLoadedKey(src);
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
      setReady(true);
    };
    img.src = src;
    return () => {
      cancelled = true;
      imgRef.current = null;
    };
  }, [src, open]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const r = sourceRect(img.naturalWidth, img.naturalHeight, {
      zoom,
      panX: pan.x,
      panY: pan.y,
    });
    ctx.fillStyle = "#0a0f1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, r.sx, r.sy, r.sw, r.sh, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(249,230,192,0.35)";
    ctx.lineWidth = 1;
    for (const f of [1 / 3, 2 / 3]) {
      ctx.beginPath();
      ctx.moveTo(canvas.width * f, 0);
      ctx.lineTo(canvas.width * f, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * f);
      ctx.lineTo(canvas.width, canvas.height * f);
      ctx.stroke();
    }
  }, [zoom, pan]);

  useEffect(() => {
    if (open && ready) draw();
  }, [open, ready, draw]);

  const addPan = useCallback((dx: number, dy: number) => {
    setPan((p) => ({ x: clampPan(p.x + dx), y: clampPan(p.y + dy) }));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const start = dragRef.current;
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!start || !canvas || !img?.naturalWidth) return;
    const rect = canvas.getBoundingClientRect();
    const r = sourceRect(img.naturalWidth, img.naturalHeight, {
      zoom,
      panX: pan.x,
      panY: pan.y,
    });
    const spanX = img.naturalWidth - r.sw;
    const spanY = img.naturalHeight - r.sh;
    // 1:1 grab: el píxel arrastrado sigue al dedo.
    const dPanX = spanX > 0 ? ((start.x - e.clientX) / rect.width) * (r.sw / spanX) * 2 : 0;
    const dPanY = spanY > 0 ? ((start.y - e.clientY) / rect.height) * (r.sh / spanY) * 2 : 0;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: clampPan(p.x + dPanX), y: clampPan(p.y + dPanY) }));
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const apply = () => {
    const img = imgRef.current;
    if (!img?.naturalWidth || busy) return;
    setBusy(true);
    const out = document.createElement("canvas");
    out.width = EXPORT_W;
    out.height = Math.round(EXPORT_W / CARD_ASPECT);
    const ctx = out.getContext("2d");
    if (!ctx) {
      setBusy(false);
      return;
    }
    const r = sourceRect(img.naturalWidth, img.naturalHeight, {
      zoom,
      panX: pan.x,
      panY: pan.y,
    });
    ctx.drawImage(img, r.sx, r.sy, r.sw, r.sh, 0, 0, out.width, out.height);
    out.toBlob(
      (blob) => {
        setBusy(false);
        if (!blob) return;
        onApply(new File([blob], "foto.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92
    );
  };

  const arrowBtn =
    "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/15 text-lg text-white/85 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-200";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[min(94dvw,26rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/10 bg-night-900 p-6 text-white shadow-2xl"
        >
          <Dialog.Title className="font-display text-xl text-gold-200">
            Encuadrar foto
          </Dialog.Title>
          <p className="mt-1 text-xs text-white/60">
            Arrastra para elegir qué parte se ve en la carta. También con flechas y zoom.
          </p>

          <canvas
            ref={canvasRef}
            width={360}
            height={Math.round(360 / CARD_ASPECT)}
            tabIndex={0}
            role="img"
            aria-label="Vista previa del recorte. Usa flechas para mover y más o menos para zoom."
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") addPan(-PAN_STEP, 0);
              else if (e.key === "ArrowRight") addPan(PAN_STEP, 0);
              else if (e.key === "ArrowUp") addPan(0, -PAN_STEP);
              else if (e.key === "ArrowDown") addPan(0, PAN_STEP);
              else if (e.key === "+" || e.key === "=") setZoom((z) => clampZoom(z + 0.2));
              else if (e.key === "-") setZoom((z) => clampZoom(z - 0.2));
              else return;
              e.preventDefault();
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onWheel={(e) => setZoom((z) => clampZoom(z - e.deltaY * 0.002))}
            className="mt-4 w-full cursor-grab touch-none rounded-2xl border border-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-200 active:cursor-grabbing"
          />

          <div className="mt-4">
            <label htmlFor="crop-zoom" className="mb-1.5 block text-xs tracking-[0.2em] text-cream-300/80">
              ZOOM · {Math.round(zoom * 100)}%
            </label>
            <input
              id="crop-zoom"
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(clampZoom(Number(e.target.value)))}
              className="w-full min-h-[44px] accent-[#d9bc6a]"
            />
          </div>

          <div className="mt-2 flex items-center justify-center gap-2" aria-label="Mover encuadre">
            <button type="button" aria-label="Mover a la izquierda" onClick={() => addPan(-PAN_STEP, 0)} className={arrowBtn}>←</button>
            <div className="flex flex-col gap-2">
              <button type="button" aria-label="Mover arriba" onClick={() => addPan(0, -PAN_STEP)} className={arrowBtn}>↑</button>
              <button type="button" aria-label="Mover abajo" onClick={() => addPan(0, PAN_STEP)} className={arrowBtn}>↓</button>
            </div>
            <button type="button" aria-label="Mover a la derecha" onClick={() => addPan(PAN_STEP, 0)} className={arrowBtn}>→</button>
          </div>

          <p aria-live="polite" role="status" className="sr-only">
            {ready && loadedKey === src
              ? `Zoom ${Math.round(zoom * 100)} por ciento`
              : "Cargando foto"}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Dialog.Close asChild>
              <button
                type="button"
                className="min-h-[48px] cursor-pointer rounded-full border border-white/15 text-xs tracking-[0.2em] text-white/80 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-200"
              >
                CANCELAR
              </button>
            </Dialog.Close>
            <button
              type="button"
              disabled={busy || !(ready && loadedKey === src)}
              onClick={apply}
              className="min-h-[48px] cursor-pointer rounded-full bg-gradient-to-b from-gold-200 to-gold-500 text-xs font-medium tracking-[0.2em] text-black hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-200 disabled:cursor-wait disabled:opacity-70"
            >
              {busy ? "…" : "USAR RECORTE"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

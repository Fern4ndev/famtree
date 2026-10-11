"use client";

import { useState } from "react";
import Image from "next/image";

export const COVER_FRONT_SRC = "/img/cover-front.png";
export const COVER_BACK_SRC = "/img/cover-back.png";

/**
 * Arte full-bleed de tapa. Si el PNG no existe (404), muestra el arte CSS.
 * Coloca tus archivos en `public/img/cover-front.png` y `cover-back.png`
 * (proporción ~0.72, peso comedido).
 */
export function CoverArt({ src, alt, fallback }: { src: string; alt: string; fallback: React.ReactNode }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    <>
      <span className="book-cover__art" aria-hidden="true">
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 768px) 100dvw, 50dvw"
          style={{ objectFit: "cover" }}
          priority
          onError={() => setFailed(true)}
        />
      </span>
      <span className="sr-only">{alt}</span>
    </>
  );
}

function Corner({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="book-cover__corner"
      style={style}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    >
      <path d="M6 94 V34 Q6 6 34 6 H94" />
      <path d="M18 94 V40 Q18 18 40 18 H94" strokeWidth="2.5" opacity="0.8" />
      <path d="M30 30 q14 -2 18 -14" />
      <circle cx="30" cy="30" r="4" fill="currentColor" stroke="none" />
      <path d="M70 22 q2 12 -8 16" />
      <circle cx="70" cy="22" r="3" fill="currentColor" stroke="none" />
      <path d="M22 70 q12 2 16 -8" />
      <circle cx="22" cy="70" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Medallion() {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 200 200" className="book-cover__medallion" aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="none" stroke="var(--metal-2)" strokeWidth="3" opacity="0.9" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="var(--metal-hi)" strokeWidth="1.2" opacity="0.7" />
      <circle cx="100" cy="100" r="62" fill="rgba(36,18,9,0.35)" stroke="var(--metal-2)" strokeWidth="2.5" />
      {petals.map((a) => (
        <ellipse
          key={a}
          cx="100"
          cy="62"
          rx="10"
          ry="30"
          fill="none"
          stroke="var(--metal-1)"
          strokeWidth="2.5"
          transform={`rotate(${a} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="26" fill="none" stroke="var(--metal-hi)" strokeWidth="2" />
      <circle cx="100" cy="100" r="9" fill="var(--metal-1)" opacity="0.9" />
    </svg>
  );
}

function FrontArt({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <div className="book-cover__frame" aria-hidden="true" />
      <Corner style={{ top: "6%", left: "7%" }} />
      <Corner style={{ top: "6%", right: "7%", transform: "scaleX(-1)" }} />
      <Corner style={{ bottom: "6%", left: "7%", transform: "scaleY(-1)" }} />
      <Corner style={{ bottom: "6%", right: "7%", transform: "scale(-1)" }} />
      <span className="absolute inset-0 flex flex-col items-center justify-center p-[10%] text-center" style={{ gap: "calc(var(--u) * 2.5)" }}>
        <Medallion />
        <span
          className="book-cover__title block leading-tight"
          style={{ fontSize: "calc(var(--u) * 8)" }}
        >
          {title}
        </span>
        <span
          className="block tracking-[0.35em]"
          style={{ color: "var(--metal-1)", fontSize: "calc(var(--u) * 2.8)" }}
        >
          {subtitle}
        </span>
      </span>
    </>
  );
}

export function BookCover({
  title,
  subtitle,
  onOpen,
}: {
  title: string;
  subtitle: string;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      aria-label={`Abrir el álbum ${title}`}
      className="book-cover book-cover__float relative block h-full w-full cursor-pointer"
    >
      <CoverArt
        src={COVER_FRONT_SRC}
        alt={`Portada del álbum ${title}`}
        fallback={<FrontArt title={title} subtitle={subtitle} />}
      />
      <span
        className="absolute bottom-[7%] left-1/2 -translate-x-1/2 rounded-full border px-[6%] py-[2%] tracking-[0.25em]"
        style={{
          borderColor: "color-mix(in srgb, var(--metal-2) 75%, transparent)",
          color: "var(--metal-hi)",
          fontSize: "calc(var(--u) * 2.6)",
          background: "rgba(0,0,0,0.35)",
        }}
      >
        ABRIR
      </span>
      <div className="book-cover__sheen" aria-hidden="true" />
    </button>
  );
}

export function BookBack() {
  return (
    <div className="book-cover book-cover--back relative h-full w-full" aria-hidden="true">
      <CoverArt
        src={COVER_BACK_SRC}
        alt=""
        fallback={
          <>
            <div className="book-cover__frame" />
            <Corner style={{ top: "6%", left: "7%" }} />
            <Corner style={{ top: "6%", right: "7%", transform: "scaleX(-1)" }} />
            <Corner style={{ bottom: "6%", left: "7%", transform: "scaleY(-1)" }} />
            <Corner style={{ bottom: "6%", right: "7%", transform: "scale(-1)" }} />
          </>
        }
      />
    </div>
  );
}

"use client";

import { useState } from "react";

export default function ShareAlbumButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="max-w-full truncate rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-cream-300/80">
        {url}
      </code>
      <button
        onClick={copy}
        aria-live="polite"
        className="min-h-[44px] cursor-pointer rounded-full border border-gold-500/40 bg-gold-500/10 px-5 text-xs tracking-[0.15em] text-gold-200 transition-all hover:bg-gold-500/20"
      >
        {copied ? "¡COPIADO ✓" : "COPIAR ENLACE"}
      </button>
    </div>
  );
}

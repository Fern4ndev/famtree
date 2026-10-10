"use client";

import { useActionState } from "react";
import ShareAlbumButton from "./ShareAlbumButton";
import { ALBUM_THEMES } from "@/lib/members/album";
import {
  updateAlbumSettings,
  type AlbumActionResult,
} from "@/app/album/actions";

export default function AlbumSettings({
  title,
  theme,
  isPublic,
  shareUrl,
}: {
  title: string;
  theme: string;
  isPublic: boolean;
  shareUrl: string;
}) {
  const [state, formAction, pending] = useActionState(
    async (
      _prev: AlbumActionResult,
      fd: FormData
    ): Promise<AlbumActionResult> => updateAlbumSettings(fd),
    { ok: true }
  );

  return (
    <details className="relative mt-6 w-full max-w-6xl rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
      <summary className="min-h-[44px] cursor-pointer text-xs tracking-[0.25em] text-white/70">
        AJUSTES DEL ÁLBUM
      </summary>
      <form action={formAction} className="flex flex-wrap items-end gap-3 pb-2 pt-1">
        <div>
          <label htmlFor="album-title" className="mb-1 block text-[11px] tracking-[0.2em] text-cream-300/70">
            TÍTULO
          </label>
          <input
            id="album-title"
            name="title"
            defaultValue={title}
            maxLength={120}
            className="min-h-[44px] rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus-visible:outline-2 focus-visible:outline-gold-200"
          />
        </div>
        <div>
          <label htmlFor="album-theme" className="mb-1 block text-[11px] tracking-[0.2em] text-cream-300/70">
            TEMA
          </label>
          <select
            id="album-theme"
            name="theme"
            defaultValue={theme}
            className="min-h-[44px] cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white"
          >
            {ALBUM_THEMES.map((t) => (
              <option key={t} value={t} className="bg-night-900">
                {t}
              </option>
            ))}
          </select>
        </div>
        <label
          htmlFor="album-public"
          className="flex min-h-[44px] cursor-pointer items-center gap-2 text-sm text-white/80"
        >
          <input
            id="album-public"
            name="is_public"
            type="checkbox"
            defaultChecked={isPublic}
            className="h-5 w-5 accent-[#b89a68]"
          />
          Público (cualquiera con el enlace lo ve)
        </label>
        <button
          type="submit"
          disabled={pending}
          className="min-h-[44px] cursor-pointer rounded-full bg-gradient-to-b from-gold-200 to-gold-500 px-6 text-xs font-medium tracking-[0.15em] text-black transition-all hover:scale-[1.02] disabled:opacity-70"
        >
          {pending ? "GUARDANDO…" : "GUARDAR"}
        </button>
      </form>
      {state.error && (
        <p role="alert" className="pb-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      {isPublic && (
        <div className="pb-3">
          <ShareAlbumButton url={shareUrl} />
        </div>
      )}
    </details>
  );
}

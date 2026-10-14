"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AlbumCard from "@/components/AlbumCard";
import { createMember } from "./actions";
import {
  ACCEPTED_PHOTO_TYPES,
  MAX_PHOTO_BYTES,
  RARITIES,
} from "@/lib/members/schema";

const inputCls =
  "w-full min-h-[48px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold-200";
const labelCls =
  "mb-1.5 block text-xs tracking-[0.2em] text-cream-300/80";
const errorCls = "mt-1 text-xs text-red-300";

export default function NewMemberForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState("Tu familiar");

  const onPhotoChange = (file: File | undefined) => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setErrors((e) => ({ ...e, photo: "Solo webp, jpeg o png" }));
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setErrors((e) => ({ ...e, photo: "Máximo 2 MB" }));
      return;
    }
    setErrors((e) => {
      if (!("photo" in e)) return e;
      const rest = { ...e };
      delete rest.photo;
      return rest;
    });
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    setErrors({});
    try {
      const result = await createMember(formData);
      if (result.ok && result.memberId) {
        router.push(`/card/${result.memberId}`);
      } else {
        setErrors(result.errors ?? { _form: "Error desconocido" });
      }
    } catch {
      setErrors({ _form: "No se pudo contactar al servidor. Revisa tu conexión e inténtalo de nuevo." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1fr_320px]">
      <form
        action={handleSubmit}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="full_name" className={labelCls}>
              NOMBRE COMPLETO *
            </label>
            <input
              id="full_name"
              name="full_name"
              required
              maxLength={120}
              autoComplete="off"
              placeholder="Ej. Elena Marchetti"
              className={inputCls}
              onChange={(e) => setPreviewName(e.target.value || "Tu familiar")}
            />
            {errors.full_name && <p className={errorCls}>{errors.full_name}</p>}
          </div>

          <div>
            <label htmlFor="birth_year" className={labelCls}>
              AÑO NACIMIENTO
            </label>
            <input
              id="birth_year"
              name="birth_year"
              type="number"
              min={1000}
              max={new Date().getFullYear()}
              placeholder="1924"
              className={inputCls}
            />
            {errors.birth_year && <p className={errorCls}>{errors.birth_year}</p>}
          </div>

          <div>
            <label htmlFor="death_year" className={labelCls}>
              AÑO FALLECIMIENTO
            </label>
            <input
              id="death_year"
              name="death_year"
              type="number"
              min={1000}
              max={new Date().getFullYear()}
              placeholder="2001"
              className={inputCls}
            />
            {errors.death_year && <p className={errorCls}>{errors.death_year}</p>}
          </div>

          <div>
            <label htmlFor="occupation" className={labelCls}>
              OCUPACIÓN
            </label>
            <input
              id="occupation"
              name="occupation"
              maxLength={120}
              autoComplete="off"
              placeholder="Ej. Maestra"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="birthplace" className={labelCls}>
              LUGAR
            </label>
            <input
              id="birthplace"
              name="birthplace"
              maxLength={120}
              autoComplete="off"
              placeholder="Ej. Chicago, Illinois"
              className={inputCls}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="bio" className={labelCls}>
              HISTORIA (MÁX 1000)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              maxLength={1000}
              placeholder="Lo que la hizo especial…"
              className={`${inputCls} resize-none`}
            />
            {errors.bio && <p className={errorCls}>{errors.bio}</p>}
          </div>

          <div>
            <label htmlFor="rarity" className={labelCls}>
              RAREZA
            </label>
            <select id="rarity" name="rarity" defaultValue="common" className={`${inputCls} appearance-none`}>
              {RARITIES.map((r) => (
                <option key={r} value={r} className="bg-night-900">
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="photo" className={labelCls}>
              FOTO * (WEBP/JPG/PNG, MÁX 2 MB)
            </label>
            <input
              id="photo"
              name="photo"
              type="file"
              required
              accept={ACCEPTED_PHOTO_TYPES.join(",")}
              className="w-full min-h-[48px] text-sm text-white/70 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-gold-500/20 file:px-5 file:py-2.5 file:text-xs file:tracking-widest file:text-gold-200"
              onChange={(e) => onPhotoChange(e.target.files?.[0])}
            />
            {errors.photo && <p className={errorCls}>{errors.photo}</p>}
          </div>
        </div>

        {errors._form && (
          <p role="alert" className="mt-4 text-sm text-red-300">
            {errors._form}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 flex w-full min-h-[48px] cursor-pointer items-center justify-center rounded-full bg-gradient-to-b from-gold-200 to-gold-500 px-7 py-3 text-sm font-medium tracking-[0.15em] text-black shadow-[0_0_40px_rgba(255,220,160,0.35)] transition-all hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-200 disabled:cursor-wait disabled:opacity-70"
        >
          {saving ? "GUARDANDO…" : "CREAR CARTA"}
        </button>
      </form>

      <aside aria-label="Vista previa" className="flex flex-col items-center gap-3">
        <p className="text-[11px] tracking-[0.3em] text-white/50">
          VISTA PREVIA
        </p>
        {previewUrl ? (
          <AlbumCard name={previewName} imageUrl={previewUrl} rarity="common" />
        ) : (
          <div className="flex h-[420px] w-full max-w-[300px] items-center justify-center rounded-3xl border border-dashed border-white/15 text-center text-sm text-white/40">
            Sube una foto para verla aquí
          </div>
        )}
      </aside>
    </div>
  );
}

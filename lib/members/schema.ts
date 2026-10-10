import { z } from "zod";

export const RARITIES = ["common", "rare", "epic", "legendary"] as const;
export type Rarity = (typeof RARITIES)[number];

const CURRENT_YEAR = new Date().getFullYear();

const optionalYear = z
  .number({ error: "Año inválido" })
  .int("El año debe ser entero")
  .min(1000, "Año inválido")
  .max(CURRENT_YEAR, `No mayor a ${CURRENT_YEAR}`)
  .optional();

export const memberSchema = z
  .object({
    full_name: z
      .string({ error: "El nombre es obligatorio" })
      .trim()
      .min(1, "El nombre es obligatorio")
      .max(120, "Máximo 120 caracteres"),
    birth_year: optionalYear,
    death_year: optionalYear,
    occupation: z.string().trim().max(120, "Máximo 120 caracteres").optional(),
    birthplace: z.string().trim().max(120, "Máximo 120 caracteres").optional(),
    bio: z.string().trim().max(1000, "Máximo 1000 caracteres").optional(),
    rarity: z.enum(RARITIES, { error: "Rareza inválida" }),
  })
  .refine(
    (v) =>
      v.birth_year === undefined ||
      v.death_year === undefined ||
      v.death_year >= v.birth_year,
    { message: "Fallecimiento anterior al nacimiento", path: ["death_year"] }
  );

export type MemberInput = z.infer<typeof memberSchema>;

export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
export const ACCEPTED_PHOTO_TYPES = ["image/webp", "image/jpeg", "image/png"];

export function validatePhoto(file: unknown):
  | { ok: true; file: File }
  | { ok: false; error: string } {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "La foto es obligatoria" };
  }
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    return { ok: false, error: "Solo webp, jpeg o png" };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { ok: false, error: "Máximo 2 MB" };
  }
  return { ok: true, file };
}

/** Convierte "" en undefined para que los opcionales validen bien. */
export function emptyToUndefined(record: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(record)) {
    out[k] = v === "" ? undefined : v;
  }
  return out;
}

"use server";

import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateAlbum } from "@/lib/members/album";
import {
  emptyToUndefined,
  memberSchema,
  validatePhoto,
} from "@/lib/members/schema";

export interface CreateMemberResult {
  ok: boolean;
  memberId?: string;
  errors?: Record<string, string>;
}

export async function createMember(
  formData: FormData
): Promise<CreateMemberResult> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false, errors: { _form: "Sesión requerida" } };

  const photo = validatePhoto(formData.get("photo"));
  const num = (v: FormDataEntryValue | null) => {
    const s = String(v ?? "").trim();
    if (s === "") return undefined;
    return Number(s);
  };
  const parsed = memberSchema.safeParse(
    emptyToUndefined({
      full_name: String(formData.get("full_name") ?? ""),
      birth_year: num(formData.get("birth_year")),
      death_year: num(formData.get("death_year")),
      occupation: String(formData.get("occupation") ?? ""),
      birthplace: String(formData.get("birthplace") ?? ""),
      bio: String(formData.get("bio") ?? ""),
      rarity: String(formData.get("rarity") ?? "common"),
    })
  );

  if (!photo.ok) {
    return { ok: false, errors: { photo: photo.error } };
  }
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "_form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors };
  }

  const albumId = await getOrCreateAlbum(supabase, auth.user.id);
  const { data: member, error: insertError } = await supabase
    .from("members")
    .insert({ album_id: albumId, ...parsed.data })
    .select("id")
    .single();
  if (insertError || !member) {
    return { ok: false, errors: { _form: "No se pudo guardar la carta" } };
  }

  try {
    const webp = await sharp(Buffer.from(await photo.file.arrayBuffer()))
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    const photoPath = `${auth.user.id}/${member.id}.webp`;
    const { error: uploadError } = await supabase.storage
      .from("stickers")
      .upload(photoPath, webp, { contentType: "image/webp", upsert: true });
    if (uploadError) throw uploadError;
    const { error: updateError } = await supabase
      .from("members")
      .update({ photo_path: photoPath })
      .eq("id", member.id);
    if (updateError) throw updateError;
  } catch {
    await supabase.from("members").delete().eq("id", member.id);
    return { ok: false, errors: { photo: "No se pudo subir la foto" } };
  }

  return { ok: true, memberId: member.id as string };
}

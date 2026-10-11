"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateAlbum } from "@/lib/members/album";

export interface AlbumActionResult {
  ok: boolean;
  error?: string;
  pageId?: string;
}

async function ownedAlbumId() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const albumId = await getOrCreateAlbum(supabase, auth.user.id);
  return { supabase, albumId };
}

/** Pega o mueve una carta a (page, slot). Revierte si el hueco está ocupado. */
export async function placeMember(
  memberId: string,
  pageId: string,
  slot: number
): Promise<AlbumActionResult> {
  const ctx = await ownedAlbumId();
  if (!ctx) return { ok: false, error: "Sesión requerida" };
  const { supabase, albumId } = ctx;

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("id", memberId)
    .eq("album_id", albumId)
    .single();
  const { data: page } = await supabase
    .from("album_pages")
    .select("id, slots")
    .eq("id", pageId)
    .eq("album_id", albumId)
    .single();
  if (!member || !page) return { ok: false, error: "Carta o página inválida" };
  // 9 huecos fijos por cara (la columna `slots` queda informativa).
  if (slot < 1 || slot > 9) {
    return { ok: false, error: "Hueco inválido" };
  }

  const { error } = await supabase
    .from("members")
    .update({ page_id: pageId, slot, placed_at: new Date().toISOString() })
    .eq("id", memberId);
  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Ese hueco ya está ocupado" };
    }
    return { ok: false, error: "No se pudo pegar la carta" };
  }
  revalidatePath("/album");
  return { ok: true };
}

/** Devuelve una carta a la bandeja (sin pegar). */
export async function unplaceMember(
  memberId: string
): Promise<AlbumActionResult> {
  const ctx = await ownedAlbumId();
  if (!ctx) return { ok: false, error: "Sesión requerida" };
  const { error } = await ctx.supabase
    .from("members")
    .update({ page_id: null, slot: null, placed_at: null })
    .eq("id", memberId)
    .eq("album_id", ctx.albumId);
  if (error) return { ok: false, error: "No se pudo despegar la carta" };
  revalidatePath("/album");
  return { ok: true };
}

/** Crea una página nueva al final del álbum. */export async function createPage(
  formData: FormData
): Promise<AlbumActionResult> {
  const ctx = await ownedAlbumId();
  if (!ctx) return { ok: false, error: "Sesión requerida" };
  const { supabase, albumId } = ctx;

  const title = String(formData.get("title") ?? "").trim().slice(0, 80);
  const slots = Math.min(
    12,
    Math.max(1, Number(formData.get("slots") ?? 6) || 6)
  );
  const { data: last } = await supabase
    .from("album_pages")
    .select("page_number")
    .eq("album_id", albumId)
    .order("page_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  const pageNumber = ((last?.page_number as number | undefined) ?? 0) + 1;

  const { data: page, error } = await supabase
    .from("album_pages")
    .insert({
      album_id: albumId,
      page_number: pageNumber,
      title: title || `Página ${pageNumber}`,
      slots,
    })
    .select("id")
    .single();
  if (error || !page) return { ok: false, error: "No se pudo crear la página" };
  revalidatePath("/album");
  return { ok: true, pageId: page.id as string };
}

/** Título, tema y visibilidad del álbum propio. */
export async function updateAlbumSettings(
  formData: FormData
): Promise<AlbumActionResult> {
  const ctx = await ownedAlbumId();
  if (!ctx) return { ok: false, error: "Sesión requerida" };
  const { supabase, albumId } = ctx;

  const title = String(formData.get("title") ?? "").trim().slice(0, 120);
  const { error } = await supabase
    .from("albums")
    .update({
      ...(title ? { title } : {}),
      is_public: formData.get("is_public") === "on",
    })
    .eq("id", albumId);
  if (error) return { ok: false, error: "No se pudo guardar" };
  revalidatePath("/album");
  return { ok: true };
}

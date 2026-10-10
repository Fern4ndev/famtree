import { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** Primer álbum del usuario; lo crea (con página 1) si no existe. */
export async function getOrCreateAlbum(
  supabase: Supabase,
  ownerId: string
): Promise<string> {
  const { data: existing } = await supabase
    .from("albums")
    .select("id")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (existing) return existing.id as string;

  const { data: album, error } = await supabase
    .from("albums")
    .insert({ owner_id: ownerId, title: "Mi árbol familiar" })
    .select("id")
    .single();
  if (error || !album) throw new Error("No se pudo crear el álbum");
  await supabase
    .from("album_pages")
    .insert({ album_id: album.id, page_number: 1, title: "Página 1" });
  return album.id as string;
}

import { notFound } from "next/navigation";
import AlbumFlipBook from "@/components/album-book/AlbumFlipBook";
import { createClient } from "@/lib/supabase/server";

/** Vista pública del álbum como libro (solo lectura, sin login). */
export default async function SharedAlbumPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: album } = await supabase
    .from("albums")
    .select("id, title, is_public")
    .eq("slug", slug)
    .single();
  if (!album || !(album.is_public as boolean)) notFound();

  const { p } = await searchParams;
  const initialPage = Math.max(0, Number(p ?? 0) || 0);

  const { data: pages } = await supabase
    .from("album_pages")
    .select("id, page_number, title, slots")
    .eq("album_id", album.id)
    .order("page_number");

  const { data: members } = await supabase
    .from("members")
    .select("id, full_name, birth_year, death_year, rarity, photo_path, page_id, slot")
    .eq("album_id", album.id)
    .not("page_id", "is", null)
    .order("created_at");

  const boardMembers = await Promise.all(
    (members ?? []).map(async (m) => {
      let imageUrl = "";
      if (m.photo_path) {
        const { data: signed } = await supabase.storage
          .from("stickers")
          .createSignedUrl(m.photo_path as string, 3600);
        imageUrl = signed?.signedUrl ?? "";
      }
      return {
        id: m.id as string,
        full_name: m.full_name as string,
        birth_year: (m.birth_year as number | null) ?? null,
        death_year: (m.death_year as number | null) ?? null,
        rarity: m.rarity as "common" | "rare" | "epic" | "legendary",
        imageUrl,
        page_id: (m.page_id as string | null) ?? null,
        slot: (m.slot as number | null) ?? null,
      };
    })
  );

  return (
    <AlbumFlipBook
      albumId={album.id as string}
      title={album.title as string}
      pages={(pages ?? []).map((pg) => ({
        id: pg.id as string,
        page_number: pg.page_number as number,
        title: (pg.title as string | null) ?? null,
        slots: pg.slots as number,
      }))}
      members={boardMembers}
      mode="readonly"
      isPublic
      shareUrl=""
      initialPage={initialPage}
    />
  );
}

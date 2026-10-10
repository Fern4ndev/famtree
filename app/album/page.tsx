import { headers } from "next/headers";
import { redirect } from "next/navigation";
import NavBar from "@/components/layout/NavBar";
import AlbumBoard from "@/components/AlbumBoard";
import AlbumSettings from "@/components/AlbumSettings";
import { createClient, getUser } from "@/lib/supabase/server";
import { getOrCreateAlbum, isAlbumTheme } from "@/lib/members/album";

export default async function AlbumPage() {
  const user = await getUser();
  if (!user) redirect("/login");
  const supabase = await createClient();
  const albumId = await getOrCreateAlbum(supabase, user.id);

  const { data: album } = await supabase
    .from("albums")
    .select("id, title, slug, theme, is_public")
    .eq("id", albumId)
    .single();
  if (!album) redirect("/login");

  const theme = isAlbumTheme(album.theme) ? album.theme : "sepia";
  const host = (await headers()).get("host") ?? "";
  const shareUrl = `https://${host}/a/${album.slug as string}`;

  const { data: pages } = await supabase
    .from("album_pages")
    .select("id, page_number, title, slots")
    .eq("album_id", albumId)
    .order("page_number");

  const { data: members } = await supabase
    .from("members")
    .select(
      "id, full_name, birth_year, death_year, rarity, photo_path, page_id, slot"
    )
    .eq("album_id", albumId)
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
    <>
      <NavBar />
      <main
        className={`album-theme-${theme} relative flex min-h-screen flex-col items-center overflow-hidden bg-night-950 px-6 py-24 text-white`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "var(--veil)" }}
        />
        <div className="relative w-full max-w-6xl text-center">
          <p className="text-[11px] tracking-[0.4em] text-white/60">TU ÁLBUM</p>
          <h1 className="mt-3 font-display text-3xl text-[var(--acc)] sm:text-4xl">
            {album.title as string}
          </h1>
        </div>

        <AlbumSettings
          title={album.title as string}
          theme={theme}
          isPublic={(album.is_public as boolean) ?? false}
          shareUrl={shareUrl}
        />

        <div className="relative mt-8 flex w-full justify-center">
          <AlbumBoard
            pages={(pages ?? []).map((p) => ({
              id: p.id as string,
              page_number: p.page_number as number,
              title: (p.title as string | null) ?? null,
              slots: p.slots as number,
            }))}
            members={boardMembers}
          />
        </div>
      </main>
    </>
  );
}

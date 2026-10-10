import { notFound } from "next/navigation";
import Link from "next/link";
import AlbumCard from "@/components/AlbumCard";
import { createClient } from "@/lib/supabase/server";

/** Vista pública de un álbum compartido (`is_public`). Sin login. */
export default async function SharedAlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: album } = await supabase
    .from("albums")
    .select("id, title, theme, is_public")
    .eq("slug", slug)
    .single();
  if (!album || !(album.is_public as boolean)) notFound();

  const theme = ["sepia", "midnight", "bosque"].includes(album.theme as string)
    ? (album.theme as string)
    : "sepia";

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

  const withPhotos = await Promise.all(
    (members ?? []).map(async (m) => {
      let imageUrl = "";
      if (m.photo_path) {
        const { data: signed } = await supabase.storage
          .from("stickers")
          .createSignedUrl(m.photo_path as string, 3600);
        imageUrl = signed?.signedUrl ?? "";
      }
      return { ...m, imageUrl: imageUrl as string };
    })
  );

  const years = (m: { birth_year: unknown; death_year: unknown }) =>
    m.birth_year == null && m.death_year == null
      ? null
      : `${(m.birth_year as number | null) ?? "?"} – ${(m.death_year as number | null) ?? "…"}`;

  return (
    <main
      className={`album-theme-${theme} flex min-h-screen flex-col items-center bg-night-950 px-6 py-16 text-white`}
    >
      <p className="text-[11px] tracking-[0.4em] text-white/60">
        ÁLBUM COMPARTIDO
      </p>
      <h1 className="mt-3 text-center font-display text-3xl text-[var(--acc)] sm:text-4xl">
        {album.title as string}
      </h1>

      {(pages ?? []).map((p) => {
        const placed = withPhotos.filter((m) => m.page_id === p.id);
        if (placed.length === 0) return null;
        return (
          <section key={p.id as string} className="mt-10 w-full max-w-6xl">
            <h2 className="text-center font-display text-2xl text-[var(--acc)]">
              {(p.title as string | null) ?? `Página ${p.page_number as number}`}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {placed.map((m) => (
                <div key={m.id as string} className="flex flex-col items-center gap-2">
                  {m.imageUrl ? (
                    <AlbumCard
                      name={m.full_name as string}
                      imageUrl={m.imageUrl}
                      rarity={m.rarity as "common" | "rare" | "epic" | "legendary"}
                    />
                  ) : (
                    <div className="flex h-[420px] w-full max-w-[300px] items-center justify-center rounded-3xl border border-white/10 text-sm text-white/40">
                      Sin foto disponible
                    </div>
                  )}
                  <p className="text-center text-sm text-cream-100">
                    {m.full_name as string}
                  </p>
                  {years(m) && (
                    <p className="text-xs tracking-[0.2em] text-cream-300/70">
                      {years(m)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <Link
        href="/"
        className="mt-12 rounded-full border border-white/10 bg-white/5 px-7 py-3 text-xs tracking-[0.2em] backdrop-blur-xl transition-all hover:bg-white/10"
      >
        CREA TU PROPIO ÁLBUM
      </Link>
    </main>
  );
}

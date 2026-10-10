import AlbumCard from "@/components/AlbumCard";
import NavBar from "@/components/layout/NavBar";

// Carta de ejemplo — muestra el estilo único del álbum.
// En Fase 1 se reemplaza por las cartas reales del usuario (Supabase).
export default function AlbumPage() {
  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-night-950 px-6 py-24 text-white">
        <div className="text-center">
          <p className="text-[11px] tracking-[0.4em] text-white/60">
            TU ÁLBUM
          </p>
          <h1 className="mt-3 font-display text-3xl text-gold-200 sm:text-4xl">
            Página 1
          </h1>
        </div>

        <AlbumCard
          name="Elena Marchetti"
          imageUrl="/img/vino.jpg"
          rarity="legendary"
        />

        <p className="max-w-sm text-center text-sm leading-relaxed text-white/50">
          Ejemplo del estilo de carta. Tus familiares aparecerán aquí cuando
          los agregues en la Fase 1.
        </p>
      </main>
    </>
  );
}

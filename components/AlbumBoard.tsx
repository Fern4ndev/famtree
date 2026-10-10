"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AlbumCard from "@/components/AlbumCard";
import { placeMember, unplaceMember, createPage } from "@/app/album/actions";

export interface BoardMember {
  id: string;
  full_name: string;
  birth_year: number | null;
  death_year: number | null;
  rarity: "common" | "rare" | "epic" | "legendary";
  imageUrl: string;
  page_id: string | null;
  slot: number | null;
}

export interface BoardPage {
  id: string;
  page_number: number;
  title: string | null;
  slots: number;
}

const RARITY_STYLE: Record<BoardMember["rarity"], string> = {
  common: "border-white/15 bg-white/5 text-white/60",
  rare: "border-gold-500/40 bg-gold-500/10 text-gold-300",
  epic: "border-orange-400/40 bg-orange-400/10 text-orange-300",
  legendary:
    "border-gold-200/60 bg-gradient-to-r from-gold-200/20 to-gold-500/20 text-gold-200",
};

function years(m: BoardMember) {
  if (m.birth_year == null && m.death_year == null) return null;
  return `${m.birth_year ?? "?"} – ${m.death_year ?? "…"}`;
}

export default function AlbumBoard({
  pages,
  members,
}: {
  pages: BoardPage[];
  members: BoardMember[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [activePageId, setActivePageId] = useState(pages[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [optimistic, applyOptimistic] = useOptimistic(
    members,
    (
      state: BoardMember[],
      update: { id: string; page_id: string | null; slot: number | null }
    ) =>
      state.map((m) =>
        m.id === update.id
          ? { ...m, page_id: update.page_id, slot: update.slot }
          : m
      )
  );

  const activePage = pages.find((p) => p.id === activePageId) ?? pages[0];
  const tray = optimistic.filter((m) => m.page_id === null);
  const placed = (slot: number) =>
    activePage
      ? optimistic.find((m) => m.page_id === activePage.id && m.slot === slot)
      : undefined;

  const onSlotClick = (slot: number) => {
    if (!activePage) return;
    const occupant = placed(slot);
    if (occupant) {
      setSelectedId(occupant.id);
      setNotice(null);
      return;
    }
    if (!selectedId) {
      setNotice("Elige una carta de la bandeja (o una pegada) y luego un hueco vacío.");
      return;
    }
    const id = selectedId;
    setSelectedId(null);
    setNotice(null);
    startTransition(async () => {
      applyOptimistic({ id, page_id: activePage.id, slot });
      const res = await placeMember(id, activePage.id, slot);
      if (!res.ok) {
        setNotice(res.error ?? "No se pudo pegar la carta");
        router.refresh();
      }
    });
  };

  const onUnplace = (id: string) => {
    setSelectedId(null);
    setNotice(null);
    startTransition(async () => {
      applyOptimistic({ id, page_id: null, slot: null });
      const res = await unplaceMember(id);
      if (!res.ok) {
        setNotice(res.error ?? "No se pudo despegar la carta");
        router.refresh();
      }
    });
  };

  return (
    <div className="w-full max-w-6xl">
      {/* Pestañas de página + nueva página */}
      <div className="flex flex-wrap items-center gap-2">
        {pages.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setActivePageId(p.id);
              setSelectedId(null);
              setNotice(null);
            }}
            aria-pressed={p.id === activePage?.id}
            className={`min-h-[44px] cursor-pointer rounded-full border px-5 text-xs tracking-[0.15em] transition-all ${
              p.id === activePage?.id
                ? "border-[var(--acc)] bg-[var(--acc-soft)] text-[var(--acc)]"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {(p.title ?? `Página ${p.page_number}`).toUpperCase()}
          </button>
        ))}
      </div>

      <form
        action={async (fd) => {
          const res = await createPage(fd);
          if (res.ok && res.pageId) {
            setActivePageId(res.pageId);
            router.refresh();
          } else {
            setNotice(res.error ?? "No se pudo crear la página");
          }
        }}
        className="mt-3 flex flex-wrap items-end gap-2"
      >
        <div>
          <label htmlFor="page-title" className="mb-1 block text-[11px] tracking-[0.2em] text-cream-300/70">
            NUEVA PÁGINA
          </label>
          <input
            id="page-title"
            name="title"
            maxLength={80}
            placeholder="Ej. Abuelos paternos"
            className="min-h-[44px] rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/35 focus-visible:outline-2 focus-visible:outline-gold-200"
          />
        </div>
        <div>
          <label htmlFor="page-slots" className="mb-1 block text-[11px] tracking-[0.2em] text-cream-300/70">
            HUECOS
          </label>
          <input
            id="page-slots"
            name="slots"
            type="number"
            min={1}
            max={12}
            defaultValue={6}
            className="min-h-[44px] w-20 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus-visible:outline-2 focus-visible:outline-gold-200"
          />
        </div>
        <button
          type="submit"
          className="min-h-[44px] cursor-pointer rounded-full border border-gold-500/40 bg-gold-500/10 px-5 text-xs tracking-[0.15em] text-gold-200 transition-all hover:bg-gold-500/20"
        >
          + PÁGINA
        </button>
      </form>

      {notice && (
        <p role="alert" className="mt-4 text-sm text-gold-200">
          {notice}
        </p>
      )}

      {/* Página activa: slots */}
      {activePage && (
        <section aria-label={activePage.title ?? `Página ${activePage.page_number}`} className="mt-6">
          <h2 className="font-display text-2xl text-[var(--acc)]">
            {activePage.title ?? `Página ${activePage.page_number}`}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: activePage.slots }, (_, i) => i + 1).map(
              (slot) => {
                const m = placed(slot);
                return (
                  <div key={slot} className="flex flex-col items-center gap-2">
                    {m ? (
                      <>
                        <div
                          className={`w-full max-w-[300px] rounded-3xl transition-all ${
                            selectedId === m.id
                              ? "ring-2 ring-[var(--acc)] ring-offset-2 ring-offset-night-950"
                              : ""
                          }`}
                        >
                          <AlbumCard
                            name={m.full_name}
                            imageUrl={m.imageUrl}
                            rarity={m.rarity}
                          />
                        </div>
                        <p className="text-center text-sm text-cream-100">
                          {m.full_name}
                        </p>
                        {years(m) && (
                          <p className="text-xs tracking-[0.2em] text-cream-300/70">
                            {years(m)}
                          </p>
                        )}
                        <span
                          className={`rounded-full border px-3 py-0.5 text-[11px] tracking-[0.2em] ${RARITY_STYLE[m.rarity]}`}
                        >
                          {m.rarity.toUpperCase()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setSelectedId(selectedId === m.id ? null : m.id)
                            }
                            aria-pressed={selectedId === m.id}
                            className="min-h-[44px] cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 text-xs tracking-widest text-white/70 hover:bg-white/10"
                          >
                            {selectedId === m.id ? "ELEGIDA" : "MOVER"}
                          </button>
                          <button
                            onClick={() => onUnplace(m.id)}
                            className="min-h-[44px] cursor-pointer rounded-full border border-white/10 bg-transparent px-4 text-xs tracking-widest text-white/50 hover:text-white"
                          >
                            QUITAR
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => onSlotClick(slot)}
                        aria-label={`Hueco ${slot} vacío, pegar carta elegida`}
                        className="flex h-[420px] w-full max-w-[300px] cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-white/15 text-white/35 transition-all hover:border-gold-400/50 hover:text-gold-200"
                      >
                        <span className="font-display text-4xl">{slot}</span>
                        <span className="text-xs tracking-[0.25em]">
                          {selectedId ? "PEGAR AQUÍ" : "VACÍO"}
                        </span>
                      </button>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* Bandeja */}
      <section aria-label="Bandeja sin pegar" className="mt-10">
        <h2 className="font-display text-2xl text-[var(--acc)]">Bandeja</h2>
        <p className="mt-1 text-sm text-white/50">
          Cartas aún sin pegar. Elige una y luego un hueco vacío.
        </p>
        {tray.length === 0 ? (
          <p className="mt-4 text-sm text-white/40">
            Sin cartas pendientes.{" "}
            <a href="/card" className="text-gold-300 underline underline-offset-4">
              Crea la primera →
            </a>
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tray.map((m) => (
              <div key={m.id} className="flex flex-col items-center gap-2">
                <div
                  className={`w-full max-w-[300px] rounded-3xl transition-all ${
                    selectedId === m.id
                      ? "ring-2 ring-[var(--acc)] ring-offset-2 ring-offset-night-950"
                      : ""
                  }`}
                >
                  <AlbumCard
                    name={m.full_name}
                    imageUrl={m.imageUrl}
                    rarity={m.rarity}
                  />
                </div>
                <p className="text-center text-sm text-cream-100">{m.full_name}</p>
                <button
                  onClick={() =>
                    setSelectedId(selectedId === m.id ? null : m.id)
                  }
                  aria-pressed={selectedId === m.id}
                  className={`min-h-[44px] cursor-pointer rounded-full border px-5 text-xs tracking-[0.15em] transition-all ${
                    selectedId === m.id
                      ? "border-[var(--acc)] bg-[var(--acc-soft)] text-[var(--acc)]"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {selectedId === m.id ? "ELEGIDA ✓" : "ELEGIR"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

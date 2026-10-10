"use client";

import Link from "next/link";
import AlbumCard from "@/components/AlbumCard";
import type { BoardMember } from "@/lib/album-book/types";

/** Bandeja lateral derecha: cartas sin pegar. Se pliega sobre el libro. */
export default function TraySidebar({
  members,
  selectedId,
  open,
  onToggle,
  onSelect,
}: {
  members: BoardMember[];
  selectedId: string | null;
  open: boolean;
  onToggle: () => void;
  onSelect: (id: string | null) => void;
}) {
  return (
    <aside
      aria-label="Bandeja de cartas sin pegar"
      className={`absolute bottom-6 right-0 top-[72px] z-30 flex w-44 transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-[calc(100%-2.75rem)]"
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-label={open ? "Plegar bandeja" : `Abrir bandeja, ${members.length} pendientes`}
        className="flex min-h-[44px] w-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 self-center rounded-l-2xl border border-r-0 border-white/15 bg-black/75 py-3 text-white/85 backdrop-blur-xl"
      >
        <span aria-hidden="true">{open ? "›" : "‹"}</span>
        <span className="text-[10px] tracking-[0.2em] [writing-mode:vertical-rl]">
          {members.length}
        </span>
      </button>
      <div className="flex-1 overflow-y-auto border-y border-l border-white/10 bg-black/75 backdrop-blur-xl">
        {members.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs leading-relaxed text-white/50">
            Sin cartas pendientes.{" "}
            <Link href="/card" className="text-gold-300 underline underline-offset-4">
              Crea la primera →
            </Link>
          </p>
        ) : (
          <ul className="flex flex-col gap-4 p-3" aria-label="Cartas sin pegar">
            {members.map((m) => (
              <li key={m.id} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-full rounded-xl transition-all ${
                    selectedId === m.id ? "ring-2 ring-[var(--acc)] ring-offset-2 ring-offset-black" : ""
                  }`}
                >
                  <AlbumCard
                    name={m.full_name}
                    imageUrl={m.imageUrl}
                    rarity={m.rarity}
                    interactive={false}
                  />
                </div>
                <p className="w-full truncate text-center text-[11px] text-white/80">
                  {m.full_name}
                </p>
                <button
                  onClick={() => onSelect(selectedId === m.id ? null : m.id)}
                  aria-pressed={selectedId === m.id}
                  className={`min-h-[44px] w-full cursor-pointer rounded-full border px-3 text-[11px] tracking-[0.15em] transition-all ${
                    selectedId === m.id
                      ? "border-[var(--acc)] bg-[var(--acc-soft)] text-[var(--acc)]"
                      : "border-white/15 bg-white/5 text-white/80"
                  }`}
                >
                  {selectedId === m.id ? "ELEGIDA" : "ELEGIR"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

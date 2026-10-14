"use client";

import AlbumCard from "@/components/AlbumCard";
import type { BoardMember } from "@/lib/album-book/types";

/**
 * Hueco del álbum. La carta pegada se muestra sola, estática y sin
 * adornos: sin tilt, sin nombre, sin botones.
 * - Clic en carta pegada = elegirla para mover (anillo dorado).
 * - Clic de nuevo en la elegida = devolverla a la bandeja.
 */
export default function BookSlot({
  member,
  slotNumber,
  pageId,
  canInteract,
  selected,
  eager,
  onSelect,
  onPlace,
  onUnplace,
  landed,
}: {
  member: BoardMember | undefined;
  slotNumber: number;
  pageId: string;
  canInteract: boolean;
  selected: boolean;
  eager: boolean;
  onSelect: (id: string | null) => void;
  onPlace: (pageId: string, slot: number) => void;
  onUnplace: (id: string) => void;
  landed: boolean;
}) {
  if (!member) {
    if (!canInteract) {
      return (
        <div className="book-slot flex aspect-[0.72] flex-col items-center justify-center">
          <span className="font-display" style={{ fontSize: "calc(var(--u) * 8)" }}>
            {slotNumber}
          </span>
        </div>
      );
    }
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onPlace(pageId, slotNumber)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPlace(pageId, slotNumber);
          }
        }}
        aria-label={`Hueco ${slotNumber} vacío`}
        className="book-slot flex aspect-[0.72] cursor-pointer flex-col items-center justify-center gap-[8%] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-200"
      >
        <span className="font-display" style={{ fontSize: "calc(var(--u) * 8)" }}>
          {slotNumber}
        </span>
        <span style={{ fontSize: "calc(var(--u) * 2.4)", letterSpacing: "0.2em" }}>
          VACÍO
        </span>
      </div>
    );
  }

  const card = (
    <AlbumCard
      name={member.full_name}
      imageUrl={member.imageUrl}
      rarity={member.rarity}
      eager={eager}
      interactive={false}
    />
  );

  if (!canInteract) {
    return <div data-placed={member.id}>{card}</div>;
  }

  // Div (no <button>): así los arrastres que nacen sobre la carta
  // los gestiona el libro (pasar hoja) y el clic sigue funcionando.
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      title={`Carta de ${member.full_name}`}
      aria-label={`Carta de ${member.full_name}${selected ? ", elegida: pulsa para devolverla a la bandeja" : ", pulsa para moverla"}`}
      onClick={() => {
        if (selected) onUnplace(member.id);
        else onSelect(member.id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (selected) onUnplace(member.id);
          else onSelect(member.id);
        }
      }}
      className={`cursor-pointer rounded-3xl transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-200 ${
        selected ? "ring-2 ring-[var(--acc)] ring-offset-2 ring-offset-transparent" : ""
      } ${landed ? "book-slot--land" : ""}`}
      data-placed={member.id}
    >
      {card}
    </div>
  );
}

"use client";

import type { BoardMember } from "@/lib/album-book/types";
import { gridFor } from "@/lib/album-book/layout";
import BookSlot from "./BookSlot";

export default function PageFace({
  pageNumber,
  side,
  pageId,
  slotNumbers,
  members,
  canInteract,
  eager,
  selectedId,
  landedKey,
  onSelect,
  onPlace,
  onUnplace,
}: {
  pageNumber: number;
  side: "left" | "right";
  pageId: string;
  slotNumbers: number[];
  members: BoardMember[];
  canInteract: boolean;
  eager: boolean;
  selectedId: string | null;
  landedKey: string | null;
  onSelect: (id: string | null) => void;
  onPlace: (pageId: string, slot: number) => void;
  onUnplace: (id: string) => void;
}) {
  const grid = gridFor(slotNumbers.length);
  const bySlot = new Map(members.filter((m) => m.page_id === pageId).map((m) => [m.slot as number, m]));

  return (
    <div className="book-face h-full w-full">
      <div className="book-face__filigree" aria-hidden="true" />
      <div className="flex h-full flex-col px-[8%] py-[7%]">
        <div
          className="flex flex-1 flex-wrap content-center items-start justify-center"
          style={{ gap: "calc(var(--u) * 4)" }}
        >
          {slotNumbers.map((n) => (
            <div key={n} style={{ width: `${Math.floor(100 / grid.cols) - 4}%`, minWidth: "25%" }}>
              <BookSlot
                member={bySlot.get(n)}
                slotNumber={n}
                pageId={pageId}
                canInteract={canInteract}
                selected={selectedId != null && bySlot.get(n)?.id === selectedId}
                eager={eager}
                onSelect={onSelect}
                onPlace={onPlace}
                onUnplace={onUnplace}
                landed={landedKey === `${pageId}:${n}`}
              />
            </div>
          ))}
        </div>
        <p
          className="text-center"
          style={{ color: "var(--ink)", opacity: 0.65, fontSize: "calc(var(--u) * 2.8)", letterSpacing: "0.3em" }}
        >
          {pageNumber}
        </p>
      </div>
      <div className={`book-face__fold book-face__fold--${side}`} aria-hidden="true" />
    </div>
  );
}

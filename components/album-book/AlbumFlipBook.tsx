"use client";

import "@openpageflip/core/styles.css";
import "./book.css";
import "./flip.css";
import { FlipBook, Page, type Book } from "@openpageflip/react";
import {
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import PageFace from "@/components/album-book/PageFace";
import TraySidebar from "@/components/album-book/TraySidebar";
import { CoverArt, COVER_BACK_SRC, COVER_FRONT_SRC } from "@/components/album-book/BookCovers";
import { BookChrome } from "@/components/album-book/BookChrome";
import SettingsDialog from "@/components/album-book/SettingsDialog";
import {
  placeMember,
  unplaceMember,
} from "@/app/album/actions";
import type { BoardMember, BoardPage } from "@/lib/album-book/types";

const TOP_CHROME = 64;
// Solo queda aire inferior (sin nav de páginas).
const BOTTOM_CHROME = 40;

// Snapshot estable: debe devolver el MISMO objeto si nada cambió,
// o useSyncExternalStore entra en bucle infinito.
const viewportCache = { w: 1440, h: 900 };
function getViewportSnapshot() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (viewportCache.w !== w || viewportCache.h !== h) {
    viewportCache.w = w;
    viewportCache.h = h;
  }
  return viewportCache;
}
const serverViewport = { w: 1440, h: 900 };

function useViewport() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("resize", cb);
      return () => window.removeEventListener("resize", cb);
    },
    getViewportSnapshot,
    () => serverViewport
  );
}

/**
 * Libro del álbum sobre @openpageflip. Cada `album_page` = UNA cara
 * (slots 1…9 en 3×3). Tapas duras con PNG.
 */
export default function AlbumFlipBook({
  albumId,
  title,
  pages,
  members,
  isPublic,
  shareUrl,
  initialPage,
  mode = "edit",
}: {
  albumId: string;
  title: string;
  pages: BoardPage[];
  members: BoardMember[];
  isPublic: boolean;
  shareUrl: string;
  initialPage: number;
  mode?: "edit" | "readonly";
}) {
  const router = useRouter();
  const bookRef = useRef<Book>(null);
  const [, startTransition] = useTransition();
  const [page, setPage] = useState(initialPage);
  const canEdit = mode === "edit";
  const viewport = useViewport();
  const handheld = viewport.w < 640;
  // El alto manda: la página más ancha admisible es la que cabe en el alto
  // disponible (viewport menos chrome superior e inferior).
  const maxPageWidth = Math.max(
    200,
    Math.round((viewport.h - TOP_CHROME - BOTTOM_CHROME) * 0.72)
  );

  const [optimistic, applyOptimistic] = useOptimistic(
    members,
    (
      prev: BoardMember[],
      update: { id: string; page_id: string | null; slot: number | null }
    ) =>
      prev.map((m) =>
        m.id === update.id
          ? { ...m, page_id: update.page_id, slot: update.slot }
          : m
      )
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [liveMsg, setLiveMsg] = useState("");
  const [trayOpen, setTrayOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [landedKey, setLandedKey] = useState<string | null>(null);

  const tray = optimistic.filter((m) => m.page_id === null);

  useEffect(() => {
    try {
      window.history.replaceState(null, "", `?p=${page}`);
      window.localStorage.setItem(`famtree-book:${albumId}`, String(page));
    } catch {
      /* sin almacenamiento */
    }
  }, [page, albumId]);

  const place = async (id: string, pageId: string, slot: number) => {
    setSelectedId(null);
    setNotice(null);
    startTransition(async () => {
      applyOptimistic({ id, page_id: pageId, slot });
      const res = await placeMember(id, pageId, slot);
      if (res.ok) {
        setLandedKey(`${pageId}:${slot}`);
        setTimeout(() => setLandedKey(null), 700);
        setLiveMsg("Carta pegada");
      } else {
        setNotice(res.error ?? "No se pudo pegar la carta");
        router.refresh();
      }
    });
  };

  const unplace = async (id: string) => {
    setSelectedId(null);
    startTransition(async () => {
      applyOptimistic({ id, page_id: null, slot: null });
      const res = await unplaceMember(id);
      if (res.ok) setLiveMsg("Carta devuelta a la bandeja");
      else {
        setNotice(res.error ?? "No se pudo despegar");
        router.refresh();
      }
    });
  };

  // Teclado global (el foco no siempre está dentro del libro).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        void bookRef.current?.flipNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        void bookRef.current?.flipPrev();
      } else if (e.key === "Home" || e.key === "Escape") {
        e.preventDefault();
        void bookRef.current?.flipTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        void bookRef.current?.flipTo(pages.length + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pages.length]);

  return (
    <div className="flip-root" role="region" aria-roledescription="libro" aria-label={title}>
      <div className="flip-stage">
        <FlipBook
          ref={bookRef}
          className="flip-frame"
          width={720}
          height={1000}
          size="stretch"
          minWidth={280}
          maxWidth={maxPageWidth}
          layout={handheld ? "single" : "auto"}
          cover
          startPage={initialPage}
          onFlip={(e) => {
            setPage(e.page);
            setLiveMsg(`Página ${e.page}`);
          }}
        >
          <Page density="hard" className="flip-cover">
            <div onClick={() => void bookRef.current?.flipNext()} className="h-full w-full cursor-pointer">
              <CoverArt
                src={COVER_FRONT_SRC}
                alt={`Portada del álbum ${title}`}
                fallback={
                  <div className="book-cover relative h-full w-full">
                    <p className="absolute inset-0 flex items-center justify-center font-display text-3xl" style={{ color: "var(--metal-hi)" }}>
                      {title}
                    </p>
                  </div>
                }
              />
            </div>
          </Page>

          {pages.map((pg, i) => {
            // 9 huecos fijos por cara (3×3); `slots` queda informativo.
            const slotNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            return (
              <Page key={pg.id} className="flip-face">
                <PageFace
                  pageNumber={pg.page_number}
                  side={i % 2 === 0 ? "right" : "left"}
                  pageId={pg.id}
                  slotNumbers={slotNumbers}
                  members={optimistic}
                  canInteract={canEdit}
                  eager={i < 2}
                  selectedId={selectedId}
                  landedKey={landedKey}
                  onSelect={setSelectedId}
                  onPlace={(pageId, slot) => {
                    if (!selectedId) {
                      setNotice("Elige primero una carta de la bandeja.");
                      return;
                    }
                    void place(selectedId, pageId, slot);
                  }}
                  onUnplace={(id) => void unplace(id)}
                />
              </Page>
            );
          })}

          <Page density="hard" className="flip-cover">
            <CoverArt
              src={COVER_BACK_SRC}
              alt=""
              fallback={<div className="book-cover book-cover--back relative h-full w-full" />}
            />
          </Page>
        </FlipBook>
      </div>

      <BookChrome
        title={title}
        canEdit={canEdit}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {notice && (
        <p
          role="alert"
          className="absolute left-1/2 top-[72px] z-30 -translate-x-1/2 rounded-full border border-gold-500/40 bg-black/80 px-5 py-2 text-sm text-gold-200"
        >
          {notice}
        </p>
      )}

      {canEdit && (
        <TraySidebar
          members={tray}
          selectedId={selectedId}
          open={trayOpen}
          onToggle={() => setTrayOpen((o) => !o)}
          onSelect={setSelectedId}
        />
      )}

      {canEdit && (
        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          title={title}
          isPublic={isPublic}
          shareUrl={shareUrl}
        />
      )}

      <p key={page} aria-live="polite" role="status" className="sr-only">
        {liveMsg || `Página ${page}`}
      </p>
    </div>
  );
}

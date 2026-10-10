"use client";

import { Dialog } from "radix-ui";
import AlbumSettings from "@/components/AlbumSettings";

export default function SettingsDialog({
  open,
  onOpenChange,
  title,
  isPublic,
  shareUrl,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  isPublic: boolean;
  shareUrl: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[min(92dvw,28rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/10 bg-night-900 p-6 text-white shadow-2xl"
        >
          <Dialog.Title className="font-display text-xl text-gold-200">
            Ajustes del álbum
          </Dialog.Title>
          <div className="mt-4 [&>details]:mt-0 [&>details]:border-0 [&>details]:bg-transparent [&>details]:p-0 [&>details>summary]:hidden">
            <AlbumSettings
              title={title}
              isPublic={isPublic}
              shareUrl={shareUrl}
            />
          </div>
          <Dialog.Close asChild>
            <button className="mt-4 min-h-[44px] w-full cursor-pointer rounded-full border border-white/15 text-xs tracking-[0.2em] text-white/80 hover:bg-white/5">
              CERRAR
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

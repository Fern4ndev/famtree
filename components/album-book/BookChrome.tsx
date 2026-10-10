"use client";

import Link from "next/link";

export function BookChrome({
  title,
  canEdit,
  onOpenSettings,
}: {
  title: string;
  canEdit: boolean;
  onOpenSettings: () => void;
}) {
  return (
    <header className="absolute left-0 right-0 top-0 z-30 flex min-h-[56px] items-center justify-between gap-3 px-4 pt-[env(safe-area-inset-top)] sm:px-6">
      <Link
        href="/"
        aria-label="Salir del álbum"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/80 backdrop-blur-xl transition-colors hover:text-white"
      >
        ←
      </Link>
      <p className="truncate font-display text-sm tracking-[0.2em] text-white/85 sm:text-base">
        {title}
      </p>
      {canEdit ? (
        <button
          onClick={onOpenSettings}
          aria-label="Ajustes del álbum"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/80 backdrop-blur-xl transition-colors hover:text-white"
        >
          ⚙
        </button>
      ) : (
        <span className="w-[44px]" aria-hidden="true" />
      )}
    </header>
  );
}

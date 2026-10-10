-- =====================================================================
-- FamTree · esquema mínimo
-- 1 usuario (Google) = 1 álbum. Una sola tabla + un bucket privado.
-- Requiere: Authentication > Providers > Google habilitado.
-- =====================================================================

create table public.stickers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,

  -- datos de la figurita (lo que muestra tu FamilyCard)
  full_name   text not null check (char_length(full_name) between 1 and 120),
  kinship     text,                 -- texto libre: "Abuela materna", "Tío Juan"
  birth_year  int,
  death_year  int,
  occupation  text,
  birthplace  text,
  photo_path  text,                 -- <user_id>/<sticker_id>.webp en el bucket "stickers"

  -- posición en el álbum: null = en la bandeja, 1..N = hueco pegado
  -- página = ceil(position / 6), no hace falta tabla de páginas
  position    int check (position >= 1),

  created_at  timestamptz not null default now(),

  -- deferrable: permite intercambiar dos figuritas con un solo upsert
  unique (user_id, position) deferrable initially deferred
);

create index stickers_user_idx on public.stickers (user_id);

-- RLS: cada usuario solo ve y modifica lo suyo
alter table public.stickers enable row level security;

create policy "stickers: owner all" on public.stickers
  for all to authenticated
  using      (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Storage: bucket privado, fotos servidas con signed URLs
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('stickers', 'stickers', false, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "stickers storage: owner all" on storage.objects
  for all to authenticated
  using      (bucket_id = 'stickers' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'stickers' and (storage.foldername(name))[1] = (select auth.uid())::text);
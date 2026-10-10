-- =====================================================================
-- FamTree · esquema de 4 tablas · login con Google
--
-- Antes de ejecutar:
--   1. Authentication > Providers > Google: habilitado (client ID + secret).
--   2. Authentication > Sign In / Providers: deja DESACTIVADO "Allow anonymous sign-ins".
--      Así todo auth.uid() corresponde a una cuenta real de Google.
-- =====================================================================

create type public.sticker_rarity as enum ('common', 'rare', 'epic', 'legendary');
create type public.relation_kind  as enum ('parent', 'partner');

-- ---------------------------------------------------------------------
-- Álbumes
-- ---------------------------------------------------------------------
create table public.albums (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null default 'Mi árbol familiar',
  slug        text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
  theme       text not null default 'sepia',
  is_public   boolean not null default false,   -- true = cualquiera con el link puede verlo
  created_at  timestamptz not null default now()
);
create index albums_owner_idx on public.albums (owner_id);

-- ---------------------------------------------------------------------
-- Páginas del álbum (cada página tiene N huecos numerados)
-- ---------------------------------------------------------------------
create table public.album_pages (
  id           uuid primary key default gen_random_uuid(),
  album_id     uuid not null references public.albums (id) on delete cascade,
  page_number  int  not null,
  title        text,                       -- ej. "Abuelos paternos"
  slots        int  not null default 6 check (slots between 1 and 12),
  unique (album_id, page_number)
);

-- ---------------------------------------------------------------------
-- Figuritas = familiares
-- page_id / slot null  => la figurita está en la bandeja (aún sin pegar)
-- ---------------------------------------------------------------------
create table public.members (
  id          uuid primary key default gen_random_uuid(),
  album_id    uuid not null references public.albums (id) on delete cascade,
  full_name   text not null check (char_length(full_name) between 1 and 120),
  birth_year  int,
  death_year  int,
  occupation  text,
  birthplace  text,
  bio         text check (char_length(bio) <= 1000),
  photo_path  text,                        -- ruta en el bucket "stickers"
  rarity      public.sticker_rarity not null default 'common',
  page_id     uuid references public.album_pages (id) on delete set null,
  slot        int  check (slot >= 1),
  placed_at   timestamptz,
  created_at  timestamptz not null default now(),
  constraint members_slot_pair check ((page_id is null) = (slot is null)),
  unique (page_id, slot)
);
create index members_album_idx on public.members (album_id);
create index members_page_idx  on public.members (page_id);

-- ---------------------------------------------------------------------
-- Relaciones para dibujar el árbol interactivo (/tree)
-- parent : from_id es padre/madre de to_id
-- partner: from_id y to_id son pareja
-- ---------------------------------------------------------------------
create table public.relationships (
  id        uuid primary key default gen_random_uuid(),
  album_id  uuid not null references public.albums (id) on delete cascade,
  from_id   uuid not null references public.members (id) on delete cascade,
  to_id     uuid not null references public.members (id) on delete cascade,
  kind      public.relation_kind not null,
  check (from_id <> to_id),
  unique (from_id, to_id, kind)
);
create index relationships_album_idx on public.relationships (album_id);

-- ---------------------------------------------------------------------
-- Al registrarse con Google: crear su primer álbum y su primera página
-- (usa el nombre que viene en el perfil de Google)
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_album_id uuid;
  display_name text;
begin
  display_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name'
  );

  insert into public.albums (owner_id, title)
  values (
    new.id,
    case
      when display_name is null then 'Mi árbol familiar'
      else 'Árbol familiar de ' || display_name
    end
  )
  returning id into new_album_id;

  insert into public.album_pages (album_id, page_number, title)
  values (new_album_id, 1, 'Página 1');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.albums        enable row level security;
alter table public.album_pages   enable row level security;
alter table public.members       enable row level security;
alter table public.relationships enable row level security;

-- Albums: el dueño hace todo; cualquiera puede leer los públicos
create policy "albums: owner all" on public.albums
  for all to authenticated
  using      (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "albums: public read" on public.albums
  for select to anon, authenticated
  using (is_public);

-- Tablas hijas: dueño del álbum / lectura si el álbum es público
create policy "pages: owner all" on public.album_pages
  for all to authenticated
  using      (exists (select 1 from public.albums a where a.id = album_id and a.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.albums a where a.id = album_id and a.owner_id = (select auth.uid())));

create policy "pages: public read" on public.album_pages
  for select to anon, authenticated
  using (exists (select 1 from public.albums a where a.id = album_id and a.is_public));

create policy "members: owner all" on public.members
  for all to authenticated
  using      (exists (select 1 from public.albums a where a.id = album_id and a.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.albums a where a.id = album_id and a.owner_id = (select auth.uid())));

create policy "members: public read" on public.members
  for select to anon, authenticated
  using (exists (select 1 from public.albums a where a.id = album_id and a.is_public));

create policy "relationships: owner all" on public.relationships
  for all to authenticated
  using      (exists (select 1 from public.albums a where a.id = album_id and a.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.albums a where a.id = album_id and a.owner_id = (select auth.uid())));

create policy "relationships: public read" on public.relationships
  for select to anon, authenticated
  using (exists (select 1 from public.albums a where a.id = album_id and a.is_public));

-- ---------------------------------------------------------------------
-- Storage: bucket PRIVADO (fotos de familia). Se sirven con signed URLs.
-- Convención de ruta: <auth.uid()>/<member_id>.webp
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('stickers', 'stickers', false, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "stickers: owner insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'stickers' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "stickers: owner update" on storage.objects
  for update to authenticated
  using (bucket_id = 'stickers' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "stickers: owner delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'stickers' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Lectura: el dueño, o cualquiera si la foto pertenece a un álbum público
create policy "stickers: read" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'stickers'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or exists (
        select 1
        from public.members m
        join public.albums a on a.id = m.album_id
        where m.photo_path = name and a.is_public
      )
    )
  );
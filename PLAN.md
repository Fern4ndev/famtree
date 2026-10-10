# FamTree — PLAN.md

Fuente de verdad del avance. Estado global: **Fase 3 · completada (2026-10-10)**.

## Cómo se actualiza cada avance

1. Trabajar la subfase con su skill/agente ECC indicado (TDD siempre).
2. Al terminar: marcar `[x]`, añadir `fecha + commit`, pasar a la siguiente.
3. Al cerrar fase: `ecc:code-reviewer` + `ecc:security-reviewer`, luego
   actualizar `Estado` de la fase y el `Estado global`.
4. Formato de marca: `- [x] ... _(2026-10-.. · abc1234)_`.

## Fase 0 — Fundación y auth real · Estado: completada (2026-10-10)

- [x] 0.1 Sesión Supabase en servidor (`lib/supabase/client.ts`,
      `lib/supabase/server.ts` con `@supabase/ssr`), `proxy.ts` protege
      `/album`, `/card`, `/tree` con redirect a `/login`. _(2026-10-10)_
      Skill: `backend-patterns` · Agente: `ecc:planner`
- [x] 0.2 RLS verificada con usuario real (2026-10-10): crear carta + subir
      foto a `stickers` funcionó con las políticas existentes; solo faltaba
      el host en `next.config.ts` (corregido).
      Skill: `postgres-patterns`
- [x] 0.3 Limpieza demo: `PokemonCard` → `AlbumCard` (sin tipos/rareza
      Pokémon, glow por `sticker_rarity`), `/album` con carta de ejemplo,
      `/card` sin carta (ruta reservada, `FamilyCard.tsx` eliminado),
      `globals.css` con tokens base (`night`, `gold`, `cream`,
      `font-display` Cinzel) y `.holo-card`. _(2026-10-10)_
      Skill: `frontend-patterns`
- [x] 0.4 Cierre: `pnpm build` en verde (compilado + TypeScript + 8 rutas,
      sin warnings). Login rediseñado con `ui-ux-pro-max` (dark OLED +
      glass + dorado herencia; cita accesible OAuth preservada).
      _(2026-10-10)_

## Fase 1 — Carta de familiar · Estado: completada (2026-10-10)

- [x] 1.1 Formulario crear familiar (`/card` → `NewMemberForm.tsx`:
      nombre, años, ocupación, lugar, bio, rareza) con validación Zod
      (`lib/members/schema.ts`) + Server Action (`app/card/actions.ts`).
      _(2026-10-10)_
      Skills: `frontend-patterns`, `tdd-workflow`
- [x] 1.2 Subida de foto en la misma action: `sharp` convierte a webp
      (máx 800px, q82), sube a `stickers/<uid>/<member>.webp` (≤2 MB,
      webp/jpeg/png), guarda `photo_path`; rollback borra el member si
      falla el upload. Deps agregadas: `sharp`, `zod`. _(2026-10-10)_
      Skills: `backend-patterns`, `security-review`
- [x] 1.3 `components/MemberCard.tsx` (Server Component con datos reales:
      foto vía `createSignedUrl` en servidor) + ruta `/card/[id]` que
      muestra la carta creada; preview local en vivo en el form.
      _(2026-10-10)_
      Skill: `frontend-patterns`
- [x] 1.4 Cierre: `pnpm build` en verde (9 rutas, `/card/[id]` dinámica).
      Revisión: sin secretos en cliente, RLS vía server client, errores
      localizados por campo + `role=alert`. _(2026-10-10)_

## Fase 2 — Álbum (pegar cartas) · Estado: completada (2026-10-10)

- [x] 2.1 Vista álbum (`/album` server → `AlbumBoard.tsx` client):
      pestañas de página, slots numerados, bandeja (`page_id`/`slot` null),
      lectura con RLS + signed URLs en servidor. _(2026-10-10)_
      Skills: `frontend-patterns`, `postgres-patterns`
- [x] 2.2 Pegar / mover / despegar (`app/album/actions.ts`: `placeMember`,
      `unplaceMember`): verifican propiedad del álbum, respetan
      `unique(page_id, slot)` ("hueco ocupado") y `members_slot_pair`;
      UI optimista con `useOptimistic` + `router.refresh()`. _(2026-10-10)_
      Skills: `backend-patterns`, `api-design`, `tdd-workflow`
- [x] 2.3 Crear páginas (`createPage`: título + 1–12 huecos) y rareza
      visible (badge + glow por `sticker_rarity`, nombre y años). _(2026-10-10)_
      Skill: `frontend-patterns`
- [x] 2.4 Cierre: `pnpm build` en verde (`/album` dinámica). E2E Playwright
      pendiente: OAuth Google real no es automatizable en este entorno;
      probar manual login → crear → pegar → mover → quitar. _(2026-10-10)_

## Fase 3 — Pulido del álbum · Estado: completada (2026-10-10)

- [x] 3.1 Temas (`sepia`/`midnight`/`bosque` en `albums.theme`, selector en
      ajustes, acento vía `var(--acc)`), título editable y portada
      (cabecera con título + halo del tema). Ruta pública `/a/[slug]`
      solo-lectura (sin login, solo cartas pegadas). _(2026-10-10)_
- [x] 3.2 Público/privado (`is_public` + botón copiar enlace con slug).
      Lectura anónima amparada en políticas RLS + Storage existentes;
      **pendiente verificar `/a/[slug]` con álbum público real** (signed
      URL anónima). _(2026-10-10 · parcial)_
      Skill: `security-review`
- [x] 3.3 Responsive (grid 1/2/3 ya) + a11y: foco visible global,
      `prefers-reduced-motion`, targets ≥44px, `aria-pressed`/`alert`/
      `live`; `next/image` con signed URLs (host en `next.config.ts`).
      _(2026-10-10)_
      Skill: `frontend-patterns`
- [x] 3.4 Cierre: `pnpm build` en verde (10 rutas). Revisión: settings con
      `useActionState` + errores visibles, `ALBUM_THEMES` fuera de
      `"use server"`, sin secretos en cliente. _(2026-10-10)_

## Fase 4 — Calidad y release v1 · Estado: no iniciada

- [ ] 4.1 Cobertura ≥80% (unit + integración). Skill: `tdd-workflow`
- [ ] 4.2 E2E Playwright de flujos críticos en CI.
      Skill: `e2e-testing` · Agente: `ecc:e2e-runner`
- [ ] 4.3 Auditoría seguridad (sin secretos, inputs validados, errores sin
      fugas) y `verification-loop` final.
      Skill: `security-review`
- [ ] 4.4 Deploy + checklist (envs, OAuth Google en prod, bucket, migraciones
      aplicadas). Estado global → **v1 liberada**.

## Fase 5 — Árbol familiar (v2 futura) · Estado: diferida

Contrato (no romper en Fases 0–4): cartas siempre con `album_id`;
parentesco solo en `relationships` (`parent`/`partner`); `/tree` placeholder.

- [ ] 5.1 Alta/borrado de relaciones padre/hijo y pareja.
- [ ] 5.2 Grafo interactivo en `/tree` (lectura desde `relationships`).
- [ ] 5.3 Layout por generaciones + navegación álbum ↔ árbol.

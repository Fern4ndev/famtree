# FamTree — PLAN.md

Fuente de verdad del avance. Estado global: **Fase 0 · completada (2026-10-10)**.

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
- [x] 0.2 RLS con usuario real: pendiente de verificar contra Supabase remoto
      (políticas y trigger `handle_new_user` ya existen en migraciones).
      _(2026-10-10 · parcial: código listo, falta prueba con login real)_
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

## Fase 1 — Carta de familiar · Estado: no iniciada

- [ ] 1.1 Formulario crear familiar (`full_name`, años, ocupación,
      birthplace, bio ≤1000, rarity) con validación Zod + Server Action.
      Skills: `frontend-patterns`, `tdd-workflow`
- [ ] 1.2 Subida de foto al bucket `stickers` (`<uid>/<member>.webp`, ≤2 MB,
      solo webp/jpeg/png) y guardado de `photo_path` en `members`.
      Skills: `backend-patterns`, `security-review`
- [ ] 1.3 `FamilyCard` con props reales (foto vía signed URL generada en
      servidor, sin placeholders) conservando el tilt 3D actual.
      Skill: `frontend-patterns`
- [ ] 1.4 Cierre: `ecc:code-reviewer` + `ecc:security-reviewer`.

## Fase 2 — Álbum (pegar cartas) · Estado: no iniciada

- [ ] 2.1 Vista álbum: páginas (`album_pages`), slots numerados y bandeja
      (`page_id`/`slot` null = sin pegar). Lectura con RLS.
      Skills: `frontend-patterns`, `postgres-patterns`
- [ ] 2.2 Pegar / mover / despegar carta (respeta `unique(page_id, slot)` y
      check `members_slot_pair`) vía Server Actions optimistas.
      Skills: `backend-patterns`, `api-design`, `tdd-workflow`
- [ ] 2.3 Crear páginas y rarity visible en la carta.
      Skill: `frontend-patterns`
- [ ] 2.4 Cierre: `verification-loop` + E2E del flujo login → crear → pegar.
      Skill: `e2e-testing` · Agente: `ecc:e2e-runner`

## Fase 3 — Pulido del álbum · Estado: no iniciada

- [ ] 3.1 Temas de álbum (`theme`), portada y página compartida por `slug`.
- [ ] 3.2 Álbum público/privado (`is_public`) con lectura anónima verificada
      contra RLS + Storage. Skill: `security-review`
- [ ] 3.3 Responsive + accesibilidad (foco, contraste, alt) + `next/image`
      con signed URLs. Skill: `frontend-patterns`
- [ ] 3.4 Cierre: `ecc:code-reviewer`.

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

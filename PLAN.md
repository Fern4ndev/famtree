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

## Fase 3b — Álbum libro (AlbumBook) · Estado: en curso (2026-10-10)

Plan detallado: `ALBUMBOOK_PLAN.md`.

- [x] 0 Preparación: vitest + RTL + jsdom + coverage, scripts `test`/`test:cov`,
      `vitest.config.ts` (alias `@`, umbral 80%), carpetas, tipos en
      `lib/album-book/types.ts` (re-exportados por `AlbumBoard`).
- [x] 2 Lógica pura `lib/album-book/` (TDD: 33 tests, cobertura 98%) +
      `bookReducer`. Nota: `turnFromPointer` sin `dir` (el giro se mide
      siempre igual; test inicial corregido).
- [x] 1+3+5 Shell 100dvh (`AlbumBook`, `Leaf` con `--turn`, `PageFace`,
      tapas doradas `BookCover`/`BookBack`, lomo, cantos con grosor variable,
      sombras `sin()`, temas con `--metal-*`/`--ink`). `AlbumCard` con
      `eager`/`interactive` (sin `priority` global).
- [x] 4 Teclado completo + drag con snap por velocidad + `?p=` y
      localStorage. Pendiente: rueda, corner-peel.
- [x] 6 Bandeja colapsable + clic-para-pegar + drag con fantasma
      (`elementFromPoint`) + pulso al aterrizar; `placeMember`/`unplaceMember`
      sin cambios. Pendiente: vuelo FLIP completo.
- [x] 7 `SettingsDialog` (Radix, reusa `AlbumSettings`+`ShareAlbumButton`),
      cambio de tema, hoja nueva (+) con salto, índice (select) + controles.
      Sin `NavBar`/WebGL en `/album`.
- [x] 10 `/a/[slug]` en modo readonly. `AlbumBoard` se conserva como
      fallback (Fase 9 decidirá "ver como lista").
- [ ] 8 Modo una página en móvil (hoy: spread escalado, usable pero pequeño).
- [ ] 9 Auditoría contraste/Lighthouse + RTL de componentes + Safari/iOS real.
- [ ] 10 Cierre: E2E Playwright (requiere Supabase local), eliminar
      `AlbumBoard` si se adopta el libro, `ecc:security-reviewer`.
- Cierre parcial (2026-10-10, rev. 2): `pnpm build` verde, `pnpm test` 33/33,
  `pnpm eslint` limpio en `album-book`/`album`/`members`.
  Incidente: `lib/album-book/` desapareció del disco (archivos sin commitear)
  y se reconstruyó idéntica desde el historial de sesión. Lección: commitear
  cada fase (ver Fase 4).
- Cambio 2026-10-10 (fuera del plan original): tema único grimorio medieval
  según spec visual (cuero #70402B, oro #B89A55/#BDA45C, pergamino #C9A56C).
  Eliminado el cambio de tema (sin migración, columna intacta): fuera
  `ALBUM_THEMES`/`isAlbumTheme`, selector en ajustes y prop `theme`.
  Tapa con medallón y esquineras SVG, lomo con nervaduras, hojas con fibra.
  Spread abierto a todo el ancho (`--page-w: min(50dvw, 100dvh·0.72)`).
- Spike OpenPageFlip (rama `spike/openpageflip`, 2026-10-10): instalados
  `@openpageflip/core` + `@openpageflip/react` 0.7.0 exactos, React 19.3.0
  (peer `^19.2.8`). Ruta `/spike` (protegida): tapas duras PNG, cada
  `album_page` = 1 cara (slots 1…9, `gridFor` ampliado a 3×3), bandeja y
  actions reutilizadas, `layout="auto"` (una página en móvil).
- Limpieza + carta estática (2026-10-10): eliminados `AlbumBoard.tsx`,
  `paging/reducer/thickness/gesture` (+ tests), `splitSlots`,
  `app/components/`, `vino.jpg`. La carta pegada es solo la carta:
  sin tilt, sin nombre, sin MOVER/QUITAR. Interacción invisible:
  clic = elegir para mover (anillo), clic de nuevo = a la bandeja.
  `pnpm build` verde, tests 3/3 (solo `gridFor`), eslint limpio en lo nuevo.
- Bandeja lateral derecha + 9 fijos + cierre (2026-10-10): `TraySidebar`
  plegable a la derecha (elimina `Tray.tsx` y `.book-tray`); caras sin
  título, 9 huecos fijos 3×3 (`slots` informativo, `placeMember` valida
  1…9); libro más alto (`BOTTOM_CHROME` 100→84). Cierre: el arrastre
  necesita cruzar el lomo (gesto real); además teclado global
  (←/→/Home/End/Escape) y botón ←. Slots y cartas son `div` con rol
  para no bloquear el arrastre (los `<button>` lo inhibían).
  Verificado con captura. `pnpm build` verde, tests 3/3.
- Cromado mínimo + 9 fijos (2026-10-10): fuera botón +hoja y nav de páginas
  (navegación por arrastre/teclado/botones de tapa); caras sin título;
  huecos con más gap y aire (3×3 respirado); vacío siempre "VACÍO".
  Libro más alto (`BOTTOM_CHROME` 84→40, bandeja lateral hasta abajo).
  `pnpm build` verde, tests 3/3, eslint limpio en lo nuevo.
- Fix alto colapsado (2026-10-10, medido en 1440×900, 1366×768 y 390×844):
  el alto lo manda el viewport (`maxWidth = (h-284)·0.72` por página),
  `minWidth={280}` + `layout single <640px` (patrón oficial Responsive) y
  libro centrado (`margin-inline: auto`).
  Causa raíz del "colapso" visto: mi `useViewport` devolvía objeto nuevo en
  cada snapshot → bucle infinito → React desmontaba el árbol.
- Fix verificado con captura (2026-10-10): las caras salían transparentes
  porque `.book-face__fold--*` (`background-image`) pisaba el `background`
  con pergamino de `.book-face` (igual especificidad, orden posterior).
  El pliegue ahora es overlay propio (`book-face__fold` + `position:relative`
  en la cara). Ruta `/spike-preview` (mock, pública) + `scripts/spike-shot.mjs`
  como harness visual.

## Fase 5 — Árbol familiar (v2 futura) · Estado: diferida

Contrato (no romper en Fases 0–4): cartas siempre con `album_id`;
parentesco solo en `relationships` (`parent`/`partner`); `/tree` placeholder.

- [ ] 5.1 Alta/borrado de relaciones padre/hijo y pareja.
- [ ] 5.2 Grafo interactivo en `/tree` (lectura desde `relationships`).
- [ ] 5.3 Layout por generaciones + navegación álbum ↔ árbol.

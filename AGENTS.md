<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# FamTree — Instrucciones del proyecto

Álbum familiar con cartas coleccionables: el usuario sube la foto de un
familiar, llena sus datos y pega la carta en su álbum. El árbol familiar
interactivo es v2 futura, pero el esquema ya debe quedar preparado.

## Stack

Next.js 16.2.6 (App Router) · React 19 · Tailwind 4 · shadcn · Supabase
(Auth Google, Postgres + RLS, Storage privado `stickers`).

## Esquema Supabase (ya existe, no romper)

`albums` → `album_pages` → `members` (carta: `full_name`, `birth_year`,
`death_year`, `occupation`, `birthplace`, `bio`, `photo_path`, `rarity`,
`page_id`/`slot` null = en bandeja sin pegar) · `relationships`
(`parent`/`partner`, reservada para el árbol v2) · trigger
`handle_new_user()` crea álbum + página 1 al registrarse.

## Reglas de código (nivel Apple/Vercel)

- App Router: Server Components por defecto; `"use client"` solo donde haya
  interactividad (tilt 3D, drag & drop, forms). Datos vía Server Actions o
  Route Handlers, nunca claves de servicio en cliente.
- `lib/supabase.ts:1` es solo cliente público. Lo sensible (signed URLs del
  bucket privado) se genera en servidor.
- Fotos: convención `<uid>/<member_id>.webp`, máx 2 MB, `image/webp|jpeg|png`.
- Componentes pequeños (<50 líneas de lógica), composición sobre herencia,
  props tipadas. Sin datos hardcodeados en UI (eliminar demo `Charizard` en
  `app/album/page.tsx` y `William Johnson` en `app/components/FamilyCard.tsx`
  al llegar a Fase 1).
- Inmutabilidad, validación con Zod en el borde (forms + actions), errores
  visibles al usuario, logs con contexto en servidor.
- Cobertura mínima 80%. TDD obligatorio: test en rojo → mínimo en verde →
  refactor.

## Skills ECC del proyecto (`.agents/skills/`)

| Skill | Cuándo |
|---|---|
| `frontend-patterns` | Componentes carta/álbum, Server vs Client, forms |
| `backend-patterns` | Server Actions, Route Handlers, acceso a datos |
| `postgres-patterns` | Migraciones, índices, RLS |
| `api-design` | Diseño de actions/endpoints y respuestas |
| `security-review` | Antes de cada commit con auth/storage/RLS |
| `tdd-workflow` | Toda feature y bugfix |
| `verification-loop` | Build + types + lint + tests + diff antes de PR |
| `e2e-testing` | Flujos críticos (login → crear carta → pegar) |

Agentes ECC vía plugin (`opencode.json`): `ecc:planner` (cada fase),
`ecc:tdd-guide`, `ecc:code-reviewer` (tras cada cambio),
`ecc:security-reviewer`, `ecc:e2e-runner`, `ecc:build-error-resolver`.

## Contrato árbol futuro (v2)

- Todo `member` pertenece a un `album_id`. No añadir cartas sin álbum.
- Las relaciones solo usan `relationships` con `kind` existente. No crear
  tablas paralelas de parentesco.
- `/tree` queda como placeholder hasta Fase 5.

## Avance

`PLAN.md` es la fuente de verdad del avance. Al completar una subfase:
marcar `[x]`, añadir fecha + hash de commit, y actualizar el estado de fase.

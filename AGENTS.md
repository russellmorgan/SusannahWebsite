# Repository Guidelines

## Project Overview

Static portfolio website for Susannah Edelbaum, a writer/editor/German-to-English translator based in Berlin. The repo is a **Webstudio (webstudio.is) export**: pre-rendered static HTML pages with a hydrated React runtime. There is no application code, build system, or dependency manifest in the repo — the site was built in Webstudio and exported here (`git log` — "imported webstudio content").

Four pages:

| Path | Route | Purpose |
|---|---|---|
| `index.html` | `/` | About Me — bio, portrait |
| `work/index.html` | `/work` | Writing — categorized external article links |
| `audio/index.html` | `/audio` | Radio and Podcasts — external links only (no `<audio>` elements) |
| `contact/index.html` | `/contact` | Contact — email link + image |

## Architecture & Data Flow

- **Static export, not a hand-built site.** Each page is complete server-rendered HTML (Vite + Vike SSG). On load, `assets/entries/entry-server-routing.*.js` (Vike bootstrap) plus a per-page module (`pages_<name>.*.js`) hydrate the DOM with Webstudio's React components.
- **All pages share an identical shell**: `<html data-ws-project="…" data-ws-last-published="…">`, one external hashed CSS file, a `vike_pageContext` JSON script, and modulepreload links. The nav/header block is **verbatim-duplicated in all four files** — if you hand-edit navigation, update every page.
- **Content edit paths**: (1) edit the static HTML directly, or (2) change the source project in Webstudio and re-export. The bundled JS/CSS under `assets/` are **immutable build artifacts** — never hand-edit them; they regenerate from Webstudio.
- Site meta lives in each page's `<head>` (title, og tags, JSON-LD). Note `og:url` and the JSON-LD `url` are still placeholders (`https://url/`) — the real production URL was never filled in.

## Key Directories

- `/` (root) — the four HTML pages are the source of truth for content
- `assets/` — media, font, and all generated bundles
  - `assets/static/` — single generated stylesheet `app_generated_index-*.css`
  - `assets/entries/` — `entry-server-routing.*.js` (Vike runtime) + `pages_<name>.*.js` (per-page components)
  - `assets/chunks/` — shared React/Webstudio runtime chunks
  - `assets/*.jpg`, `assets/*.ttf` — raw media and font (Crimson Text)

## Development Commands

There is **no build, test, or lint command** — nothing to install, compile, or run. The only commands are:

```sh
# Serve the site (required: root-relative /assets/ paths and ES modules break on file://)
python -m http.server 8000     # or: npx serve
# open http://localhost:8000

git status && git diff          # review HTML edits
```

## Code Conventions & Common Patterns

- **Class names are generated, not authored.** Every element carries `w-*` semantic component classes (`w-box`, `w-heading`, `w-text`, `w-list`, `w-link`, `w-rich-text-link`) plus auto-generated `c<hex>` utility classes (`cfuuoid`, `c1u2x4c1`, …) that map to rules in the CSS bundle. **Do not invent or rely on these `c*` classes** — they are opaque and change on re-export.
- **No inline `<style>` or `<script>` in page bodies** — styling is 100% the external hashed CSS; scripts are only the Vike JSON context and module includes. Preserve this separation if hand-editing.
- **Assets**: referenced by absolute root-relative paths (`/assets/<name>_<hash>.<ext>`); filenames carry content-hash suffixes — don't rename them, and update references if you replace a file.
- **Links between pages** are root-relative (`href="/work"`, `href="/audio"`), not file-relative.
- **Head conventions**: `<meta charset>`, viewport, `og:title`/`og:type`/`og:site_name` (`SJ`), JSON-LD `WebSite` block, font preload, then the CSS link.
- **Known placeholder**: the contact page email link is `href="#"` — a real address/action was never wired up.

## Important Files

- `index.html` — home page, defines the site-wide head + nav shell copied by the other pages
- `work/index.html` — largest page (19.8 KB); the categorized writing links live here
- `assets/static/app_generated_index-6937cd5a.gAnYEsgw.css` — the only stylesheet; breakpoints at 991/767/479 px, `@font-face` Crimson Text, no CSS custom properties
- `assets/entries/entry-server-routing.CbJocOt4.js` — Vike routing runtime (vike 0.4.229)
- `.gitattributes` — `* text=auto` (LF normalization)

## Runtime/Tooling Preferences

- **No runtime or package manager applies** — no `package.json`, no lockfiles, no `node_modules`, no `.env`.
- Any static file server works; Python's `http.server` or `npx serve` are the pragmatic defaults.
- Node is only needed if you want `npx serve`; the HTML itself requires no tooling.
- The generated JS targets modern browsers (ES modules, `modulepreload`) — no legacy browser support.

## Testing & QA

- **There is no test suite, CI, or linter** — verified by exhaustive search (no `*.test.*`, no `.github/`, no lint configs). Do not add or expect one unless asked.
- QA is manual: serve the site and check each of the four pages — navigation across all routes, image loading, and that the preload/module scripts resolve without console errors.
- Because the nav and head are duplicated, a change to one page must be mirrored across all four; a quick `grep -n 'href="/' *.html work/index.html audio/index.html contact/index.html`-style check (via the repo's grep tool) catches missed pages.

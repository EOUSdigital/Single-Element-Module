# Module 07 — DOM Manipulation (Lesson 04: Single Element)

A small, multi-page project demonstrating **safe, scoped DOM selection** and **single-element operations**. You’ll see the patterns applied in three demo pages and a shared entry script:

* **devices.html** — Toolbar + device cards (core of the lesson)
* **social-header.html** — Accessible header with menu toggle
* **travel-stay.html** — “Stay card” controller with stale-ref guard
* **main.js** — The **only** script included in HTML; it imports all helpers/components
* **single.js** — Safe single-element helper library (fail-fast/soft, `only`, `ensureConnected`)

---

## Quick start

1. **Clone or open** the project folder.
2. **Run a local server** (ES Modules don’t load reliably from `file://`):

   * VS Code: **Live Server** extension → “Go Live”
   * or: `npx http-server -p 5173` or `python -m http.server 5173`
3. Open **`/index.html`** in the browser and use the links to the demo pages.
4. Optional **dev checks**: append `?checks` to any demo URL to run the automated console checks.

   * Example: `http://localhost:5173/devices.html?checks`

---

## Project structure

```
/index.html                 ← landing page with links to demos
/devices.html               ← toolbar + cards demo (lesson focus)
/social-header.html         ← header/menu demo
/travel-stay.html           ← stay-card demo
/style.css                  ← shared styles
/main.js                    ← single entry; imports helpers & components
/single.js                  ← safe single-element helper utilities
/single-scope.js            ← optional "inScope(root)" wrapper
/components/
  toolbar.js                ← createToolbar(root)
  header.js                 ← createHeader(root)
  stay-card.js              ← createStayCard(root)
/debug/
  exit-checks.js            ← console test harness (loaded only with ?checks)
```

> **Important:** Each HTML page includes **exactly one** script tag:
>
> ```html
> <script type="module" src="./main.js"></script>
> ```

---

## Philosophy & patterns

### 1) Safe selection (single elements)

* **Fail-fast (required):** `q(selector, root?)` and `byId(id)` throw clear errors when missing.
* **Fail-soft (optional):** `qSafe(selector, root?)` returns `null`; guard with `?.` or conditionals.
* **Uniqueness:** `only(selector, root?)` throws unless **exactly one** match exists.
* **Scope everything:** always pass a **component root** to avoid global collisions.

### 2) Safer DOM operations

* **Text vs HTML:** use `setText(el, value)` for user-visible strings. Only use `setHTML` with **trusted** markup.
* **Attributes & styles:** `setAttr(el, name, value)` (works on any `Element`, including SVG); `setStyle(el, prop, value)` (hyphenated props allowed).
* **HTMLElement guard:** helpers like `addClass/removeClass` require `HTMLElement`; for SVG, use `addClassAny/removeClassAny`.

### 3) Stale reference guard

* Some UIs re-render nodes (`replaceWith`, virtual DOM diffs). Use:

  * `ensureConnected(el, reselectionFn)` before mutating a possibly replaced element.

---

## Helper API (from `single.js`)

```js
// Selection
q(selector, root?)                  // throws if not found
qSafe(selector, root?)              // returns Element | null
byId(id)                            // throws if not found
only(selector, root?)               // throws unless exactly one match

// Type guard
asHTMLElement(el)                   // throws unless HTMLElement

// Element ops (HTMLElement-only unless noted)
setText(el, text)
setHTML(el, html)                   // trusted markup only
setAttr(el, name, value)            // works on any Element (HTML or SVG)
addClass(el, cls)
removeClass(el, cls)
toggleClass(el, cls, force?)
setStyle(el, prop, value)

// Stale ref guard
ensureConnected(el, reselectionFn)

// Element-agnostic class ops (for SVG)
addClassAny(el, cls)
removeClassAny(el, cls)
toggleClassAny(el, cls, force?)
```

Optional convenience wrapper:

```js
// single-scope.js
import * as s from './single.js';
export function inScope(root) {
  return { q: sel => s.q(sel, root), qSafe: sel => s.qSafe(sel, root), only: sel => s.only(sel, root), ...s };
}
```

---

## Components

All components **accept a root element** and return a small API.

### `createToolbar(root)`  (`components/toolbar.js`)

* **Required:** `[data-ui="title"]`, `[data-ui="status"]` (singleton), `[data-ui="refresh"]`, `[data-ui="toggle"]`
* **Optional:** `[data-ui="notice"]` (often *outside* toolbar; component searches under `#app` fallback)
* **API:**

  * `setTitle(text)`
  * `setStatus('online' | 'refreshing' | 'offline')`
  * `setNoticeVisible(boolean)`
  * `destroy()`

### `createHeader(root)`  (`components/header.js`)

* **Required:** `[data-ui="logo"]`, `[data-ui="nav"]` (singleton), `[data-ui="menu.toggle"]`
* **Optional:** `[data-ui="promo"]`, `[data-ui="count"]`
* ARIA: sets `aria-controls` + `aria-expanded`; handles keyboard (Enter/Space/Escape) and click-outside close.
* **API:**

  * `setPromo(textOrNull)`
  * `setUnread(number)`  *(sets text and `aria-label`)*
  * `toggleMenu()` / `setOpen(boolean)`
  * `destroy()`

### `createStayCard(root)`  (`components/stay-card.js`)

* **Required:** `[data-ui="card.title"]`, `[data-ui="card.price"]`, `[data-ui="card.cta"]`
* Uses `ensureConnected` to survive node replacement.
* **API:**

  * `setTitle(text)`
  * `setPrice(value, currencySymbol = '£', announce = false)` *(updates text & `data-value`; optional `aria-live`)*
  * `disableCTA(ms = 1200)` *(idempotent; sets `disabled`/`aria-disabled` and restores label)*
  * *Extras:* `setCTALabel(text)`, `setCTAEnabled(bool)`, `refreshRefs()`

---

## Boot logic (`main.js`)

* Single entry point for **all pages**.
* Instantiates components **only if** their roots are present.
* Devices page also demonstrates A–F lesson exercises (scoped updates, uniqueness, ARIA sync, stale-ref guard, SVG edge).

```js
// Example (simplified)
const app       = qSafe('#app');
const toolbarEl = qSafe('[data-ui="toolbar"]', app || document);
const grid      = qSafe('[data-ui="grid"]',    app || document);

if (toolbarEl && grid) {
  const toolbar = createToolbar(toolbarEl);
  // demo logic...
}

const headerRoot = qSafe('[data-ui="header"]');
if (headerRoot) createHeader(headerRoot);

document.querySelectorAll('[data-ui="stay"]').forEach(root => createStayCard(root));
```

---

## Automated checks (`/debug/exit-checks.js`)

Load **only when needed** via URL flag:

```js
// main.js
if (new URLSearchParams(location.search).has('checks')) {
  import('./debug/exit-checks.js');
}
```

Then open a demo with `?checks` to run a console table of pass/fail results:

```
/devices.html?checks
```

---

## CSS notes (`style.css`)

* Design tokens in `:root` (colors, spacing).
* Focus ring via `:focus-visible`.
* `.hidden` utility; `.is-open` for header nav; disabled button styling.
* **Selector fix:** page uses `<main id="main">` (not `.main`).
* Respects `prefers-reduced-motion`.

---

## Development checklist

* [ ] **Exactly one** script tag per page: `<script type="module" src="./main.js"></script>`.
* [ ] No other scripts linked in HTML (`single.js`, components, debug) — import them in `main.js`.
* [ ] Required elements selected with `q()`/`only()`; optional with `qSafe()`.
* [ ] All queries **scoped** to a root. No global lookups inside components.
* [ ] Use `setText` by default; only trusted content with `setHTML`.
* [ ] Guard stale nodes with `ensureConnected`.
* [ ] SVG handled with `addClassAny`/`removeClassAny`; keep HTMLElement guards strict.

---

## Troubleshooting

* **“q is not defined” in Console:** modules don’t export to global. Use

  ```js
  const { q, qSafe, only } = await import('./single.js');
  ```

  or expose in dev:

  ```js
  import * as s from './single.js'; window.s = s;
  ```
* **Blank page / import errors:** serve over HTTP (Live Server, `http-server`, etc.), not `file://`.
* **Double execution or odd state:** check you don’t have extra `<script>` tags for `single.js` or component files.
* **Startup throw:** means a **required** selector wasn’t found. Fix the HTML hook or change it to `qSafe(...)` if it’s optional.

---

## Browser support

Modern evergreen browsers (Chromium, Firefox, Safari). ES Modules required.

---

## License

MIT (or your preferred license).

---

## Attributions

This project is part of a learning sequence for **Module 07 — DOM Manipulation** focusing on **Single Element** patterns (fail-fast vs fail-soft selection, scoping, uniqueness, stale-ref guarding, and accessibility sync).

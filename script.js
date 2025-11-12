"use Strict";

//TODO Module 07. Lesson 04. - DOM Selectors: Single Elements

//? Step 1 — Theory & Setup (Single-Element Selection & Safe Manipulation)

//* What we are building
//  A tiny, reusable “single element” helper module that standardizes how you:
//  • select one DOM node,
//  • verify it exists and is the right kind of element,
//  • perform safe, common operations (read/write text, attributes, classes, styles).
//  This gives you consistent error handling, clearer intent, and fewer bugs as your projects grow.

//* Core ideas
//  1. What counts as a “single element”?
//      • Element is the generic DOM node type returned by selectors.
//      • HTMLElement is an Element with HTML-specific APIs like .style, .classList, .dataset.
//      • SVGElement is an Element from the SVG namespace (styling and attributes differ slightly).
//  2. Selectors for one element
//      • document.getElementById(id) — fastest path to a unique node, returns HTMLElement|null.
//      • root.querySelector(cssSelector) — returns the first match under root (default document), or null.
//      • Prefer scoped queries (container.querySelector(...)) to avoid accidental global matches and to make components portable/testable.
//  3. Fail-fast vs fail-soft
//      • Fail-fast throws if the element is not found. Useful when the element is required for the page to function.
//      • Fail-soft returns null and lets the caller decide (often with optional chaining). Useful for optional UI parts.
//  4. Caching references
//      • Query once and reuse when the element is stable.
//      • If your code replaces nodes (e.g., with replaceWith or templating), cached references go stale—re-query or wire a refresh function.
//  5. Safety & correctness
//      • Guard against null and wrong element types.
//      • Prefer textContent over innerHTML to avoid XSS; only use innerHTML for trusted, controlled markup.
//      • Use data attributes (data-*) for stable hooks instead of brittle presentational classes.
//      • Be aware that querySelector returns the first match—don’t assume uniqueness unless you enforce it.
//  6. Performance notes
//      • The difference between getElementById and querySelector is negligible in typical apps. Choose clarity; optimize only if profiling demands it.
//  7. Useful document roots
//      • document (entire page)
//      • document.body, document.head, document.documentElement (for global theming/toggles)
//      • Any container element to scope selection (component root)

//! Proposed API (ES Module)
//  Create single.js as your “single element” utility. It provides both fail-fast and fail-soft helpers plus narrowers for safe use of HTML APIs.

//  single.js

//  Fail-fast: throw a clear error if not found
export function q(selector, root = document) {
    const el = root.querySelector(selector);
    if (!el) throw new Error(`q(): selector not found -> ${selector}`);
    return el;
}

//  Fail-fast: by id
export function byId(id) {
    const el = document.getElementById(id);
    if (!el) throw new Error(`byId(): #${id} not found`);
    return el;
}

//  Optional: fail-soft version (returns null if not found)
export function qSafe(selector, root = document) {
    return root.querySelector(selector);
}

//  Runtime type narrows to HTMLElement so .style/.classList safe
export function asHTMLElement(el) {
    if (!(el instanceof HTMLElement)) {
        throw new Error(`Expected HTMLElement, got ${el?.constructor?.name || el}`);
    } 
    return el;
}

//  Common single-element operations (safe & explicit)
export function setText(el, text) {
    asHTMLElement(el).textContent = String(text);
}

export function setHTML(el, html) {
    //  Use only with trusted markups
    asHTMLElement(el).innerHTML = String(html);
}

export function setAttr(el, name, value) {
    asHTMLElement(el).setAttribute(name, String(value));
}

export function addClass(el, cls) {
    asHTMLElement(el).classList.add(cls);
}

export function removeClass(el, cls) {
    asHTMLElement(el).classList.remove(cls);
}

export function toggleClass(el, cls, force) {
    asHTMLElement(el).classList.toggle(cls, force);
}

export function setStyle(el, prop, value) {
    asHTMLElement(el).style[String(prop)] = value;
}


//! Example usage

//  main.js

import { q, byId, qSafe, setText, addClass, setAttr, setStyle } from './single.js';

//  Required elements (fail-fast)
const title = q('[data-ui="title"]');
const banner = byId('banner');

//  Optional element (fail-soft)
const notice = qSafe('[data-ui="notice"]');

//  Safe operations
setText(title, 'Dashboard');
addClass(banner, 'is-visible');
setAttr(title, 'aria-live', 'polite');

//  Only if present
notice?.classList.add('slide-in');

//  Global toggles (document roots)
document.documentElement.classList.toggle('theme-dark', true);

//  Styling (be explicit about what you set)
setStyle(title, 'opacity', '1');


//! SVG edge case (awareness only for now)
//  SVG nodes don’t support all HTMLElement APIs. When styling SVG, prefer attributes:

const icon = q('svg[data-ui="icon"]');                          //  returns an SVGElement
icon.setAttribute('fill', '#555');                            //    OK
//  icon.classList works on SVG, but inline CSS via style has caveats across browsers





































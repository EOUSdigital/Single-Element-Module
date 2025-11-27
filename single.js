"use strict";

// single.js

/* ========= Selection ========= */

// Fail-fast: throws if not found
export function q(selector, root = document) {
    if (typeof selector !== 'string' || !selector) {
        throw new Error('q(): selector must be a non-empty string');
    }
    if (!(root instanceof Document || root instanceof Element)) {
        throw new Error(`q(): invalid root provided -> ${root}`);
}
const el = root.querySelector(selector);
    if (!el) throw new Error(`q(): selector not found -> ${selector}`);
    return el;
}

// Fail-fast by id
export function byId(id) {
    if (typeof id !== 'string' || !id) {
        throw new Error('byId(): id must be a non-empty string');
    }
    
    const el = document.getElementById(id);
    if (!el) throw new Error(`byId(): #${id} not found`);
    return el;
}

// Fail-soft: returns null if not found
export function qSafe(selector, root = document) {
    if (typeof selector !== 'string' || !selector) {
        throw new Error('qSafe(): selector must be a non-empty string');
    }
    
    if (!(root instanceof Document || root instanceof Element)) {
        throw new Error(`qSafe(): invalid root provided -> ${root}`);
    }
    
    return root.querySelector(selector);
}

/* ========= Type narrowing ========= */

export function asHTMLElement(el) {
    if (!(el instanceof HTMLElement)) {
        throw new Error(`asHTMLElement(): expected HTMLElement, got ${el?.constructor?.name || el}`);
    }
    return el;
}

/* ========= Element ops ========= */

// Element-agnostic (works on SVG too)
export function setAttr(el, name, value) {
    el.setAttribute(name, String(value));
}

// HTMLElement-only (guarded)
export function setText(el, text) { asHTMLElement(el).textContent = String(text); }
export function setHTML(el, html) { asHTMLElement(el).innerHTML = String(html); }
export function addClass(el, cls) { asHTMLElement(el).classList.add(cls); }
export function removeClass(el, cls) { asHTMLElement(el).classList.remove(cls); }
export function toggleClass(el, cls, force) { asHTMLElement(el).classList.toggle(cls, force); }
export function setStyle(el, prop, value) { asHTMLElement(el).style.setProperty(prop, String(value)); }

/* ========= Utilities ========= */

// Enforce exactly one match
export function only(selector, root = document) {
    if (!(root instanceof Document || root instanceof Element)) {
        throw new Error(`only(): invalid root -> ${root}`);
    }
    
    const list = root.querySelectorAll(selector);
    if (list.length === 0) throw new Error(`only(): not found -> ${selector}`);
    if (list.length > 1) throw new Error(`only(): expected 1, found ${list.length} -> ${selector}`);
    return list[0];
}

// Reselect if a reference became stale/detached
export function ensureConnected(el, reselectionFn) {
    if (el && el.isConnected) return el;
    const fresh = reselectionFn?.();
    if (!fresh) throw new Error('ensureConnected(): reselection returned null/undefined');
    return fresh;
}

// Class ops for any Element (e.g., SVG)
export function addClassAny(el, cls) { el.classList.add(cls); }
export function removeClassAny(el, cls) { el.classList.remove(cls); }
export function toggleClassAny(el, cls, force) { el.classList.toggle(cls, force); }

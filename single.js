"use strict";

//TODO  Step 2.

export function q(selector, root = document) {
    if (!(root instanceof Document || root instanceof Element)) {
        throw new Error(`q(): invalid root provided -> ${root}`);
    }
    const el = root.querySelector(selector);
    if (!el) throw new Error(`q(): selector not found -> ${selector}`);
    return el;
}

export function byId(id) {
    const el = document.getElementById(id);
    if (!el) throw new Error(`byId(): #${id} not found`);
    return el;
}

export function qSafe(selector, root = document) {
    return root.querySelector(selector);
}

export function asHTMLElement(el) {
    if (!(el instanceof HTMLElement)) {
        throw new Error(`Expected HTMLElement, got ${el?.constructor?.name || el}`);
    }
    return el;
}

export function setText(el, text) { asHTMLElement(el).textContent = String(text); }
export function setHTML(el, html) { asHTMLElement(el).innerHTML = String(html); }
export function setAttr(el, name, value) { asHTMLElement(el).setAttribute(name, String(value)); }
export function addClass(el, cls) { asHTMLElement(el).classList.add(cls); }
export function removeClass(el, cls) { asHTMLElement(el).classList.remove(cls); }
export function toggleClass(el, cls, force) { asHTMLElement(el).classList.toggle(cls, force); }
export function setStyle(el, prop, value) { asHTMLElement(el).style.setProperty(prop, value); }


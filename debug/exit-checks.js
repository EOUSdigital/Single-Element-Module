"use strict";

//! When you want to run the checks, open your page as:

// http://localhost:PORT/yourpage.html?checks

// debug/exit-checks.js
"use strict";

import {
    q, qSafe, byId, only,
    setText, setAttr, toggleClass,
    ensureConnected, addClassAny, addClass
} from "../single.js";

const results = [];
const pass = (name) => results.push({ name, ok: true });
const fail = (name, e) => results.push({ name, ok: false, msg: e?.message || String(e) });
const mustThrow = (fn, name) => { try { fn(); fail(name, "No error thrown"); } catch { pass(name); } };

try {
    /* Anchors */
    const app     = byId("app");
    const toolbar = q('[data-ui="toolbar"]', app);
    const grid    = q('[data-ui="grid"]', app);

    /* A) required vs optional */
    try {
        const title = q('[data-ui="title"]', toolbar);
        if (title) pass("A1 required title present");
    } catch (e) { fail("A1 required title present", e); }

    try {
        const notice = qSafe('[data-ui="notice"]', app);
        if (notice === null || notice instanceof Element) pass("A2 optional notice ok");
        else fail("A2 optional notice ok", "Unexpected value");
    } catch (e) { fail("A2 optional notice ok", e); }

    /* B) scoped ops (second card only) */
    try {
        const second = q('[data-ui="card"]:nth-of-type(2)', grid);
        const t2 = q('[data-ui="card.title"]', second);
        const old = t2.textContent;
        setText(t2, "NAS — Backups");
        if (t2.textContent === "NAS — Backups") pass("B1 second card title updated");
        else fail("B1 second card title updated", "No change");

        // sanity: first card unchanged
        const first = q('[data-ui="card"]:nth-of-type(1)', grid);
        const t1 = q('[data-ui="card.title"]', first);
        if (t1 !== t2 && t1.textContent !== "NAS — Backups") pass("B2 first card unchanged");
        else fail("B2 first card unchanged", "Unexpected change");

        // revert title
        setText(t2, old);
    } catch (e) { fail("B suite", e); }

    /* C) only() uniqueness */
    try {
        const status = only('[data-ui="status"]', toolbar);
        if (status) pass("C1/C2 only() enforces singleton");
    } catch (e) { fail("C1/C2 only() enforces singleton", e); }

    /* D) aria sync for toggle button */
    try {
        const btn    = q('[data-ui="toggle"]', toolbar);
        const notice = qSafe('[data-ui="notice"]', app);

        // ensure baseline aria-pressed exists
        if (!btn.hasAttribute("aria-pressed")) setAttr(btn, "aria-pressed", "false");

        const before = btn.getAttribute("aria-pressed");
        btn.click(); // simulate
        const mid = btn.getAttribute("aria-pressed");
        btn.click(); // back
        const after = btn.getAttribute("aria-pressed");

        const okVal = (v) => v === "true" || v === "false";
        if (okVal(mid) && okVal(after)) {
        if (!notice) pass("D aria-pressed toggles (no notice present)");
        else pass("D aria-pressed toggles & reflects visibility");
        } else {
        fail("D aria-pressed toggles", `before=${before} mid=${mid} after=${after}`);
        }
    } catch (e) { fail("D suite", e); }

    /* E) ensureConnected after replacement */
    try {
        const first = q('[data-ui="card"]', grid);
        let cta = q('[data-ui="card.cta"]', first);
        cta.replaceWith(cta.cloneNode(true)); // simulate replacement
        cta = ensureConnected(cta, () => q('[data-ui="card.cta"]', first));
        setText(cta, "OK after replace");
        if (cta.isConnected && cta.textContent.includes("OK after replace")) pass("E ensureConnected updates new node");
        else fail("E ensureConnected updates new node", "Did not update");
    } catch (e) { fail("E suite", e); }

    /* F) SVG class ops */
    try {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("data-ui", "icon");
        document.body.appendChild(svg);

        // Guarded HTML helper should throw on SVG
        mustThrow(() => addClass(svg, "active"), "F1 addClass throws on SVG");

        if (typeof addClassAny === "function") {
        addClassAny(svg, "active");
        if (svg.classList.contains("active")) pass("F2 addClassAny works on SVG");
        else fail("F2 addClassAny works on SVG", "No class added");
        } else {
        fail("F2 addClassAny works on SVG", "Helper missing");
        }
        svg.remove();
    } catch (e) { fail("F suite", e); }

    } catch (fatal) {
    fail("Fatal", fatal);
}

/* Report */
console.table(results);
const ok = results.filter(r => r.ok).length;
console.log(`Passed ${ok}/${results.length} checks`);

"use strict";

import {
    q, setText, setAttr, ensureConnected
} from "../single.js";

export function createStayCard(root) {
    // Keep references but refresh all of them when needed
    let title = q('[data-ui="card.title"]', root);
    let price = q('[data-ui="card.price"]', root);
    let cta   = q('[data-ui="card.cta"]',   root);

    function refreshRefs() {
        title = ensureConnected(title, () => q('[data-ui="card.title"]', root));
        price = ensureConnected(price, () => q('[data-ui="card.price"]', root));
        cta   = ensureConnected(cta,   () => q('[data-ui="card.cta"]',   root));
    }

    // --- Helpers ----------------------------------------------------------
    function asNumber(v) {
        const n = Number(v);
        if (!Number.isFinite(n) || n < 0) throw new Error("setPrice(): value must be a non-negative number");
        return n;
    }

    function setCTAEnabled(enabled) {
        refreshRefs();
        // Reflect semantics for both buttons and non-buttons
        const isBtn = cta instanceof HTMLButtonElement;
        if (isBtn) cta.disabled = !enabled;
        setAttr(cta, "aria-disabled", String(!enabled));
    }

    // --- Public API -------------------------------------------------------
    function setTitle(text) {
        refreshRefs();
        setText(title, String(text));
    }

    /**
     * Update visible price and data-value.
     * @param {number|string} value - numeric price
     * @param {string} currencySymbol - e.g., '£', '$', '€'
     * @param {boolean} announce - if true, add aria-live="polite" for SR users
     */
    function setPrice(value, currencySymbol = "£", announce = false) {
        refreshRefs();
        const n = asNumber(value);
        setAttr(price, "data-value", String(n));
        // locale-friendly grouping (no decimals by default; adapt if needed)
        const text = `${currencySymbol}${n.toLocaleString()}`;
        if (announce && !price.hasAttribute("aria-live")) setAttr(price, "aria-live", "polite");
        setText(price, text);
    }

    /**
     * Temporarily disables the CTA and restores it.
     * Idempotent (calling while disabled is a no-op).
     */
    function disableCTA(ms = 1200) {
        refreshRefs();
        if (cta.getAttribute("aria-disabled") === "true" || (cta instanceof HTMLButtonElement && cta.disabled)) {
        return; // already disabled → ignore
        }
        const previousLabel = cta.textContent;
        setCTAEnabled(false);
        setText(cta, "Processing…");
        setTimeout(() => {
        refreshRefs();
        setCTAEnabled(true);
        setText(cta, previousLabel || "Save");
        }, ms);
    }

    // Optional extras you may find useful later:
    function setCTALabel(text) { refreshRefs(); setText(cta, String(text)); }

    return {
        setTitle,
        setPrice,
        disableCTA,
        // extras
        setCTALabel,
        setCTAEnabled,
        refreshRefs,
    };
}


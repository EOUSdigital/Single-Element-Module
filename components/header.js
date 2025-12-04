"use strict";

import {
    q, qSafe, only,
    setText, setAttr, toggleClass
} from "../single.js";

export function createHeader(root) {
    // Required (enforce singletons where appropriate)
    const logo  = q('[data-ui="logo"]', root);
    const nav   = only('[data-ui="nav"]', root);
    const menuT = only('[data-ui="menu.toggle"]', root);

    // Optional
    const promo = qSafe('[data-ui="promo"]', root);
    const count = qSafe('[data-ui="count"]', root);

    // --- ARIA wiring ------------------------------------------------------
    // Tie the button to the nav
    const navId = nav.id || (() => {
        const id = `nav-${Math.random().toString(36).slice(2,8)}`;
        setAttr(nav, "id", id);
        return id;
    })();
    setAttr(menuT, "aria-controls", navId);
    if (!menuT.hasAttribute("aria-expanded")) setAttr(menuT, "aria-expanded", "false");

    // --- State & handlers -------------------------------------------------
    function setOpen(open) {
        setAttr(menuT, "aria-expanded", String(open));
        toggleClass(nav, "is-open", open);

        // optional UX: close when clicking outside
        if (open) document.addEventListener("pointerdown", onDocPointerDown, true);
        else document.removeEventListener("pointerdown", onDocPointerDown, true);
    }

    function toggleMenu() {
        const next = menuT.getAttribute("aria-expanded") !== "true";
        setOpen(next);
    }

    function onDocPointerDown(e) {
        if (!root.contains(e.target) && e.target !== menuT) setOpen(false);
    }

    function onClick() { toggleMenu(); }
    function onKeydown(e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleMenu(); }
        if (e.key === "Escape") { setOpen(false); menuT.focus(); }
    }

    menuT.addEventListener("click", onClick);
    menuT.addEventListener("keydown", onKeydown);

    // --- Public API -------------------------------------------------------
    function setPromo(textOrNull) {
        if (!promo) return;
        const show = Boolean(textOrNull);
        promo.classList.toggle("hidden", !show);
        setAttr(promo, "aria-hidden", String(!show));
        if (show) setText(promo, textOrNull);
    }

    function setUnread(n) {
        if (!count) return;
        const value = Math.max(0, Number(n) || 0);
        setText(count, value.toLocaleString());
        setAttr(count, "aria-label", `${value} unread`);
    }

    return {
        setPromo,
        setUnread,
        toggleMenu,
        setOpen,
        destroy() {
        menuT.removeEventListener("click", onClick);
        menuT.removeEventListener("keydown", onKeydown);
        document.removeEventListener("pointerdown", onDocPointerDown, true);
        }
    };
}

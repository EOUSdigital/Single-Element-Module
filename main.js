"use strict";

/* ===== Dev convenience (optional): expose helpers under window.s for console use ===== */
import * as s from "./single.js";
window.s = s; // DEV ONLY

import {
  // selection & guards
  q, qSafe, byId, only, ensureConnected,
  // element ops
  setText, setAttr, addClass, removeClass, toggleClass, setStyle,
  // element-agnostic class ops (SVG)
  addClassAny,
} from "./single.js";

import { createToolbar }  from "./components/toolbar.js";
import { createHeader }   from "./components/header.js";
import { createStayCard } from "./components/stay-card.js";

// Optional helper; only used in the demo block below
import { inScope } from "./single-scope.js";

/* =======================================================================================
  Multi-page safe boot: only act on features present on the current page
   ======================================================================================= */

// --- Toolbar + Devices grid (devices.html) --------------------------------------------
const app       = qSafe("#app");                              // may be null on other pages
const toolbarEl = qSafe('[data-ui="toolbar"]', app || document);
const grid      = qSafe('[data-ui="grid"]', app || document);

if (toolbarEl && grid) {
  const toolbar = createToolbar(toolbarEl);

  // Dynamic title based on current cards
  const cardCount = grid.querySelectorAll('[data-ui="card"]').length;
  toolbar.setTitle(`Devices (${cardCount})`);
  toolbar.setStatus("online");
  toolbar.setNoticeVisible(true);

  /* ========= A) REQUIRED vs OPTIONAL (fail-fast vs fail-soft) ========= */
  const titleEl  = q('[data-ui="title"]', toolbarEl);          // required
  const statusEl = only('[data-ui="status"]', toolbarEl);      // exactly one (required)
  const noticeEl = qSafe('[data-ui="notice"]', app || document); // optional (may be null)

  setAttr(statusEl, "aria-live", "polite");

  addClass(statusEl, "ok");
  removeClass(statusEl, "warn");
  setText(statusEl, "Online");
  setStyle(statusEl, "letter-spacing", "0.02em");
  noticeEl?.classList.remove("hidden");

  /* ========= B) SCOPED SINGLE-ELEMENT OPS (second card only) ========= */
  const secondCard         = q('[data-ui="card"]:nth-of-type(2)', grid);
  const secondCardTitle    = q('[data-ui="card.title"]',    secondCard);
  const secondCardSubtitle = q('[data-ui="card.subtitle"]', secondCard);
  const secondCardCTA      = q('[data-ui="card.cta"]',      secondCard);

  setText(secondCardTitle, "NAS — Backups");
  const subText = secondCardSubtitle.textContent.trim();
  if (!subText.includes("Uptime: 7d")) setText(secondCardSubtitle, `${subText} • Uptime: 7d`);
  setText(secondCardCTA, "Run Backup");

  /* ========= C) UNIQUENESS GUARD with only() ========= */
  // already enforced above via only('[data-ui="status"]', toolbarEl)

  /* ========= D) SAFE TOGGLE with ARIA SYNC (optional target) ========= */
  const btnRefresh = q('[data-ui="refresh"]', toolbarEl);
  const btnToggle  = q('[data-ui="toggle"]',  toolbarEl);
  if (!btnToggle.hasAttribute("aria-pressed")) setAttr(btnToggle, "aria-pressed", "false");

  btnToggle.addEventListener("click", () => {
    if (!noticeEl) return;                       // optional → safe no-op
    noticeEl.classList.toggle("hidden");
    const visible = !noticeEl.classList.contains("hidden");
    setAttr(btnToggle, "aria-pressed", String(visible));
  });

  btnRefresh.addEventListener("click", () => {
    const isOnline = statusEl.textContent.trim() === "Online";
    setText(statusEl, isOnline ? "Refreshing…" : "Online");
    toggleClass(statusEl, "ok",  !isOnline);
    toggleClass(statusEl, "warn", isOnline);
  });

  /* ========= E) STALE REFERENCE GUARD ensureConnected() ========= */
  function getFirstCTA() {
    const firstCard = q('[data-ui="card"]', grid);
    return q('[data-ui="card.cta"]', firstCard);
  }
  let firstCTA = getFirstCTA();
  firstCTA.replaceWith(firstCTA.cloneNode(true));             // simulate re-render
  firstCTA = ensureConnected(firstCTA, getFirstCTA);          // reselect if stale
  setText(firstCTA, "OK after replace");                      // writes to the new node

  /* ========= F) SVG EDGE (select ≠ HTMLElement) ========= */
  const svgIcon = qSafe('svg[data-ui="icon"]', toolbarEl);
  if (svgIcon) {
    try {
      // This should throw if your HTML helpers are correctly guarded to HTMLElement
      s.addClass(svgIcon, "active");
    } catch (e) {
      console.warn("Expected HTMLElement guard on SVG:", e.message);
      addClassAny(svgIcon, "active"); // correct path for SVG
    }
  }

  /* Optional: inScope demo (DEV ONLY). Guard behind a flag to avoid side effects. */
  if (new URLSearchParams(location.search).has("demoScope")) {
    const C2 = inScope(q('[data-ui="card"]:nth-of-type(2)', grid));
    C2.setText(C2.q('[data-ui="card.title"]'), "NAS — Backups");
  }
}

// --- Header (social-header.html) -------------------------------------------------------
const headerRoot = qSafe('[data-ui="header"]');
if (headerRoot) createHeader(headerRoot);

// --- Stay cards (travel-stay.html) ----------------------------------------------------
document.querySelectorAll('[data-ui="stay"]').forEach(root => createStayCard(root));

/* ===== Dev: run exit checks when you add ?checks to the URL (single gate) ===== */
if (new URLSearchParams(location.search).has("checks")) {
  import("./debug/exit-checks.js");
}

/* Optional expected error demo (kept harmless) */
try { if (app) q('[data-ui="does-not-exist"]', app); } 
catch (err) { console.warn("Expected error example:", err.message); }

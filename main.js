"use strict";

import {
    q, byId, qSafe,
    setText, setAttr,
    addClass, removeClass, toggleClass, setStyle,
    only, ensureConnected,
    addClassAny
} from './single.js';

/* ========= A) Required vs Optional ========= */
const app     = byId('app');                                // required
const toolbar = q('[data-ui="toolbar"]');                   // required
const title   = q('[data-ui="title"]');                     // required
const status  = only('[data-ui="status"]', toolbar);        // exactly one (required)
const notice  = qSafe('[data-ui="notice"]');                // optional (may be null)

setAttr(status, 'aria-live', 'polite');

/* ========= Base UI state ========= */
const grid = q('[data-ui="grid"]');

// Compute count from current cards (your HTML has 3)
const cardCount = grid.querySelectorAll('[data-ui="card"]').length;
setText(title, `Devices (${cardCount})`);

const firstCard         = q('[data-ui="card"]', grid);
const firstCardTitle    = q('[data-ui="card.title"]', firstCard);
const firstCardSubtitle = q('[data-ui="card.subtitle"]', firstCard);
const firstCardCTA      = q('[data-ui="card.cta"]', firstCard);

setText(firstCardTitle, 'Router — Main Hall');
setText(firstCardSubtitle, 'IP: 192.168.0.1  •  Uptime: 4d');
setText(firstCardCTA, 'Restart Router');

addClass(status, 'ok');
removeClass(status, 'warn');
setText(status, 'Online');
setStyle(status, 'letterSpacing', '0.02em');

notice?.classList.remove('hidden');

/* ========= B & D) Interactions (refresh + aria-synced toggle) ========= */
const btnRefresh = q('[data-ui="refresh"]', toolbar);
btnRefresh.addEventListener('click', () => {
    const isOnline = status.textContent.trim() === 'Online';
    setText(status, isOnline ? 'Refreshing…' : 'Online');
    toggleClass(status, 'ok', !isOnline);
    toggleClass(status, 'warn', isOnline);                      // <- fixed: mirror of ok
});

const btnToggle = q('[data-ui="toggle"]', toolbar);
if (!btnToggle.hasAttribute('aria-pressed')) setAttr(btnToggle, 'aria-pressed', 'false');

btnToggle.addEventListener('click', () => {
    if (!notice) return; // optional target
    notice.classList.toggle('hidden');
    const visible = !notice.classList.contains('hidden');
    setAttr(btnToggle, 'aria-pressed', String(visible));
});

/* ========= C) only(): uniqueness already used for status above ========= */

/* ========= E) Guard stale refs ========= */
function getFirstCTA() {
    const first = q('[data-ui="card"]', grid);
    return q('[data-ui="card.cta"]', first);
}
let firstCTA = getFirstCTA();
// simulate a re-render replacing the button
firstCTA.replaceWith(firstCTA.cloneNode(true));
// reselect safely, then update
firstCTA = ensureConnected(firstCTA, getFirstCTA);
setText(firstCTA, 'OK after replace');

/* ========= B) Scoped changes to SECOND card only ========= */
const secondCard         = q('[data-ui="card"]:nth-of-type(2)', grid);
const secondCardTitle    = q('[data-ui="card.title"]', secondCard);
const secondCardSubtitle = q('[data-ui="card.subtitle"]', secondCard);
const secondCardCTA      = q('[data-ui="card.cta"]', secondCard);

setText(secondCardTitle, 'NAS — Backups');
const subText = secondCardSubtitle.textContent.trim();
if (!subText.includes('Uptime: 7d')) {
    setText(secondCardSubtitle, `${subText} • Uptime: 7d`);
}
setText(secondCardCTA, 'Run Backup');

/* ========= F) SVG: handle as optional + Element-safe class ops ========= */
const icon = qSafe('svg[data-ui="icon"]', toolbar);                 // won’t throw if not present
if (icon) addClassAny(icon, 'active');

/* ========= Optional: tiny flourish ========= */
setStyle(status, 'transition', 'transform 200ms ease');
setStyle(status, 'transform', 'scale(1.05)');
setTimeout(() => setStyle(status, 'transform', 'scale(1)'), 200);

/* ========= Expected error demo (kept, but harmless) ========= */
try {
    q('[data-ui="does-not-exist"]');
} catch (err) {
    console.warn('Expected error example:', err.message);
}

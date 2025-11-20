"use strict";

//TODO  Step 2.

import {
    q, byId, qSafe,
    setText, setHTML, setAttr,
    addClass, removeClass, toggleClass, setStyle
} from './single.js';

//  1) Required single elements (fail-fast)
const app = byId('app');
const toolbar = q('[data-ui="toolbar"]');
const title = q('[data-ui="title"]');
const status = q('[data-ui="status"]');

//  2) Optional element (fail-soft)
const notice = qSafe('[data-ui="notice"]');

//  3) Scoped queries - operate inside a specific card only
const grid = q('[data-ui="grid"]');
const firstCard = q('[data-ui="card"]');
const firstCardTitle = q('[data-ui="card.title"]', firstCard);
const firstCardSubtitle = q('[data-ui="card.subtitle"]', firstCard);
const firstCardCTA = q('[data-ui="card.cta"]', firstCard);

//  4) Safe mutations
setText(title, 'Device (2)');
setAttr(title, 'aria-live', 'polite');
setText(firstCardTitle, 'Router - Main Hall');
setText(firstCardSubtitle, 'IP: 192.168.0.1  •  Uptime: 4d');
setText(firstCardCTA, 'Restart Router');
addClass(status, 'ok');
removeClass(status, 'warn');
setText(status, 'Online');
setStyle(status, 'letterSpacing', '0,02em');

//  Optional UI
notice?.classList.remove('hidden');

//  5) Interactions
const btnRefresh = q('[data-ui="refresh"]', toolbar);
btnRefresh.addEventListener('click', () => {
    //  Simulate a refresh: toggle status text and badge class
    const isOnline = status.textContent.trim() === 'Online';
    setText(status, isOnline ? 'Refreshing...' : 'Online');
    toggleClass(status, 'ok', !isOnline);
    toggleClass(status, 'warn', !isOnline);
});

const btnToggle = q('[data-ui="toggle"]', toolbar);
btnToggle.addEventListener('click', () => {
    //  Show/hide optional element (fail-soft target)
    if (!notice) return;                                //  qSafe nay be null
    notice.classList.toggle('hidden');
});

firstCardCTA.addEventListener('click', () => {
    setAttr(firstCardCTA, 'aria-disabled', 'true');
    addClass(firstCardCTA, 'disabled');
    setText(firstCardCTA, 'Restarting…');
    setTimeout(() => {
        setAttr(firstCardCTA, 'aria-disabled', 'false');
        removeClass(firstCardCTA, 'disabled');
        setText(firstCardCTA, 'Restart');
    }, 1500);
});


//  6) Demonstrate fail-fast with a clear message
try {
    //  This will throw if you uncomment the <span data-ui="remove-me"> in HTML
    q('[data-ui="does-not-exist"]');
} catch (err) {
    console.warn('Expected error example:', err.message);
};

//  7) Demonstrate scoping prevents accidental global matches
const secondCard = q('[data-ui="card"]:nth-of-type(2)', grid);
const secondCardTitle = q('[data-ui="card.title"]', secondCard);
setText(secondCardTitle, 'NAS - Media Vault');


"use strict";

import {
    q, qSafe, only,
    setText, setAttr, toggleClass
} from "../single.js";

export function createToolbar(root) {
    // 1) Required (scoped to toolbar root)
    const title   = q('[data-ui="title"]',  root);
    const status  = only('[data-ui="status"]',  root);
    const refresh = q('[data-ui="refresh"]', root);
    const toggle  = q('[data-ui="toggle"]',  root);

    // 2) Optional notice — commonly lives OUTSIDE the toolbar in your HTML.
    //    Fallback: search in the nearest #app container; if absent, stay null (safe no-op).
    const container = root.closest('#app') || document;
    const notice    = qSafe('[data-ui="notice"]', container);

    // 3) Accessibility defaults
    setAttr(status, 'aria-live', 'polite');
    const noticeVisible = notice ? !notice.classList.contains('hidden') : false;
    if (!toggle.hasAttribute('aria-pressed')) {
        setAttr(toggle, 'aria-pressed', String(noticeVisible));
    }

    // 4) Public API
    function setTitle(text) { setText(title, String(text)); }

    function setStatus(level /* 'online'|'refreshing'|'offline' */) {
        const isOnline     = level === 'online';
        const isRefreshing = level === 'refreshing';
        // classes
        toggleClass(status, 'ok',   isOnline);
        toggleClass(status, 'warn', !isOnline && !isRefreshing);
        // text
        setText(status, isRefreshing ? 'Refreshing…' : isOnline ? 'Online' : 'Offline');
    }

    function setNoticeVisible(visible) {
        if (notice) {
        notice.classList.toggle('hidden', !visible);
        }
        // Reflect state for AT regardless of whether notice exists.
        setAttr(toggle, 'aria-pressed', String(visible));
    }

    // 5) Event wiring
    let refreshTimer = null;
    function onRefresh() {
        if (refreshTimer) return;        // debounce re-entries
        setStatus('refreshing');
        refreshTimer = setTimeout(() => {
        refreshTimer = null;
        setStatus('online');
        }, 600);
    }

    function onToggle() {
        const next = notice ? notice.classList.contains('hidden') : false;
        setNoticeVisible(next);
    }

    refresh.addEventListener('click', onRefresh);
    toggle.addEventListener('click',  onToggle);

    // 6) Public surface
    return {
        setTitle,
        setStatus,
        setNoticeVisible,
        destroy() {
        refresh.removeEventListener('click', onRefresh);
        toggle.removeEventListener('click',  onToggle);
        if (refreshTimer) { clearTimeout(refreshTimer); refreshTimer = null; }
        }
    };
}

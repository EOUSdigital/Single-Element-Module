"use strict";

import {
    q, qSafe, only,
    setText, setAttr,
    addClass, removeClass,
    toggleClass, setStyle
} from '../single.js';

export function createToolbar(root) {
    //  1) Required & optimal (scoped)
    const title = q('[data-ui="title"]', root);                     //  required
    const status = only('[data-ui="status"]', root);                //  exactly one
    const refresh = q('[data-ui="refresh"]', root);                 //  required
    const toggle = q('[data-ui="toggle"]', root);                   //  required
    const notice = qSafe('[data-ui="notice"]', root);               //  optional (may be outside the toolbar)

    //  2) Accessibility defaults
    setAttr(status, 'aria-live', 'polite');
    if (!toggle.hasAttribute('aria-pressed')) setAttr(toggle, 'aria-pressed', 'false');

    //  3)Public API
    function setTitle(text) { setText(title, String(text)); }

    function setStatus(level /*'Online'/'refreshing'/'offline' */) {
        const isOnline = level === 'online';
        const isRefreshing = level === 'refreshing';
        //  classes
        toggleClass(status, 'ok', isOnline);
        toggleClass(status, 'warn', !isOnline && !isRefreshing);
        //  text
        setText(status, isRefreshing ? 'Refreshing...' : isOnline ? 'Online' : 'Offline');
    }

    function setNoticeVisible(visible) {
        if (!notice) return;                                        //  optional
        notice.classList.toggle('hidden', !visible);
        setAttr(toggle, 'aria-pressed', String(visible));
    }

    //  4) Event wiring
    function onRefresh() {
        setStatus('refreshing');
        setTimeout(() => setStatus('online'), 600);
    }

    function onToggle() {
        const next = notice ? notice.classList.contains('hidden') : false;
        setNoticeVisible(next);
    }

    refresh.addEventListener('click', onRefresh);
    toggle.addEventListener('click', onToggle);

    //  5) Return controls for the outside world
    return {
        setTitle,
        setStatus,
        setNoticeVisible,
        destroy() {
            refresh.removeEventListener('click', onRefresh);
            toggle.removeEventListener('click', onToggle);
        }
    };
}
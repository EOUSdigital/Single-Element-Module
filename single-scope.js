"use strict;"

// single-scope.js
import * as s from './single.js';

export function inScope(root) {
    return {
        // scoped selectors
        q: (sel) => s.q(sel, root),
        qSafe: (sel) => s.qSafe(sel, root),
        only: (sel) => s.only(sel, root),

        // passthrough ops
        setText: s.setText,
        setHTML: s.setHTML,
        setAttr: s.setAttr,
        addClass: s.addClass,
        removeClass: s.removeClass,
        toggleClass: s.toggleClass,
        setStyle: s.setStyle,
        ensureConnected: s.ensureConnected,
    };
}



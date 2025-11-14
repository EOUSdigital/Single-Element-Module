"use strict;"

import * as s from './single.js';
export const inScope = (root) => ({
    q: (sel) => s.q(sel, root),
    qSafe: (sel) => s.qSafe(sel, root),
    setText: s.setText,
    setHTML: s.setHTML,
    setAttr: s.setAttr,
    addClass: s.addClass,
    removeClass: s.removeClass,
    toggleClass: s.toggleClass,
    setStyle: s.setStyle,
});


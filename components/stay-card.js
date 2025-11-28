"use strict";

// components/stay-card.js
import { 
    q, setText, 
    setAttr, ensureConnected 
} from '../single.js';

export function createStayCard(root) {
    const title = q('[data-ui="card.title"]', root);
    let cta     = q('[data-ui="card.cta"]', root);
    const price = q('[data-ui="card.price"]', root);

    function refreshRefs() {
        cta = ensureConnected(cta, () => q('[data-ui="card.cta"]', root));
    }

    function setTitle(text) { setText(title, text); }
    function setPrice(value, currency = '£') {
        setAttr(price, 'data-value', String(value));
        setText(price, `${currency}${value}`);
    }

    function disableCTA(ms = 1200) {
        refreshRefs(); // in case the card re-rendered
        setAttr(cta, 'aria-disabled', 'true');
        setText(cta, 'Processing…');
        setTimeout(() => { setAttr(cta, 'aria-disabled', 'false'); setText(cta, 'Save'); }, ms);
    }

    return { setTitle, setPrice, disableCTA };
}

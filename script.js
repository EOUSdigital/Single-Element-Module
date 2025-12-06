"use Strict";

//TODO Module 07. Lesson 04. - DOM Selectors: Single Elements

//TODO Step 1 — Theory & Setup (Single-Element Selection & Safe Manipulation)

//? What we are building
//  A tiny, reusable “single element” helper module that standardizes how you:
//  • select one DOM node,
//  • verify it exists and is the right kind of element,
//  • perform safe, common operations (read/write text, attributes, classes, styles).
//  This gives you consistent error handling, clearer intent, and fewer bugs as your projects grow.

//? Core ideas
//  1. What counts as a “single element”?
//      • Element is the generic DOM node type returned by selectors.
//      • HTMLElement is an Element with HTML-specific APIs like .style, .classList, .dataset.
//      • SVGElement is an Element from the SVG namespace (styling and attributes differ slightly).
//  2. Selectors for one element
//      • document.getElementById(id) — fastest path to a unique node, returns HTMLElement|null.
//      • root.querySelector(cssSelector) — returns the first match under root (default document), or null.
//      • Prefer scoped queries (container.querySelector(...)) to avoid accidental global matches and to make components portable/testable.
//  3. Fail-fast vs fail-soft
//      • Fail-fast throws if the element is not found. Useful when the element is required for the page to function.
//      • Fail-soft returns null and lets the caller decide (often with optional chaining). Useful for optional UI parts.
//  4. Caching references
//      • Query once and reuse when the element is stable.
//      • If your code replaces nodes (e.g., with replaceWith or templating), cached references go stale—re-query or wire a refresh function.
//  5. Safety & correctness
//      • Guard against null and wrong element types.
//      • Prefer textContent over innerHTML to avoid XSS; only use innerHTML for trusted, controlled markup.
//      • Use data attributes (data-*) for stable hooks instead of brittle presentational classes.
//      • Be aware that querySelector returns the first match—don’t assume uniqueness unless you enforce it.
//  6. Performance notes
//      • The difference between getElementById and querySelector is negligible in typical apps. Choose clarity; optimize only if profiling demands it.
//  7. Useful document roots
//      • document (entire page)
//      • document.body, document.head, document.documentElement (for global theming/toggles)
//      • Any container element to scope selection (component root)

//? Proposed API (ES Module)
//  Create single.js as your “single element” utility. It provides both fail-fast and fail-soft helpers plus narrowers for safe use of HTML APIs.
//* single.js

//? Example usage
//* main.js

//? Common pitfalls checklist
//  • Assuming querySelector finds all matches (it returns one).
//  • Not handling null before using .classList/.style.
//  • Overusing innerHTML for dynamic text (use textContent).
//  • Selecting by presentational classes instead of durable hooks ([data-*]).
//  • Caching references that later point to removed/replaced nodes.

//? Mini design guideline
//  • Selectors: Prefer #id for unique anchors; [data-ui="name"] for component parts.
//  • Errors: Clear, actionable error messages speed up debugging.
//  • Scope: Pass a container root for componentized code.
//  • Semantics & a11y: Set ARIA/state attributes via helpers to keep concerns centralized.

//TODO  Step 2 — Guided Inquiry & Application

//  Apply the helper functions to a small, real DOM. You will select required/optional elements, scope queries, and perform safe mutations. You will also observe fail-fast vs fail-soft behavior.

//? 1) Starter files

//  • index.html
//  • single.js (use your file from Step 1)
//  • main.js

//? 2) What to observe (in your browser console)

//* 1. Fail-fast vs fail-soft:
//      • The q('[data-ui="does-not-exist"]') call is wrapped in a try/catch. You should see a clear error message in the console, proving that required elements fail-fast with actionable feedback.
//      • The optional notice is selected via qSafe; if you delete it from the HTML, the app still runs, and the toggle button safely no-ops.
//* 2. Scoped selection correctness:
//      • Changes to firstCardTitle affect only the first card. Global queries would have hit the first match and be brittle.
//* 3. Safe text updates:
//      • setText is used for user-facing content. No innerHTML is needed for plain text—avoiding XSS risks.
//* 4. Attribute and class management:
//      • setAttr(title, 'aria-live', 'polite') sets accessibility semantics in one place.
//      • addClass/removeClass/toggleClass produce predictable visual states (badges).

//? 3) Micro-tasks (do them now)
//      • A. Make an element required:
//      Replace qSafe('[data-ui="notice"]') with q('[data-ui="notice"]'). Remove the notice from the HTML and confirm that your code now throws a clear error at startup. Restore the original afterward.
//      • B. Add a “disabled” state to the first card button:
//      Set [aria-disabled="true"] and add a .disabled class on click, then revert after 1.5s. Use the helpers only.

//      • C. Prove scoping works with more cards:
//      Duplicate a <article class="card" …> in the HTML to create a third card. Update only the second card’s subtitle using:

// Example using your utility functions
const cards = document.querySelectorAll('[data-ui="card"]');
const secondCard = cards[1];
const secondCardSubtitle = q('[data-ui="card.subtitle"]', secondCard);
setText(secondCardSubtitle, 'IP: 192.168.0.10  •  Uptime: 12d');

//      • D. Style via helper:
//      Pulse the status badge once after load:

setStyle(status, 'transition', 'transform 200ms ease');
setStyle(status, 'transform', 'scale(1.05)');
setTimeout(() => setStyle(status, 'transform', 'scale(1)'), 200);

//? 4) Quick self-check (answer for yourself)
//      1. When should you choose qSafe over q?
//      2. Why is scoping with a root element safer than global queries for components?
//      3. What is the safer default for setting user-visible text: innerHTML or textContent? Why?
//      4. What happens to your cached references if the DOM node is replaced with element.replaceWith(newNode)?

//! Answer:
//      1. The sSafe function should be chosen over q every time when I need to have a clear error at startup.
//      2. Scoping queries within a specific root element is safer for component development than using global queries primarily due to two key reasons: avoiding conflicts and ensuring component isolation.
//      3. The safer default for setting user-visible text is textContent. The primary reason for this is that textContent treats the content as raw text, not as HTML markup. This inherent security feature prevents Cross-Site Scripting (XSS) attacks by automatically encoding any HTML characters.
//      4. A cached reference to a DOM node replaced by element.replaceWith(newNode) still points to the old, removed node, which is no longer in the DOM and is thus stale and unusable to access the new node.

//* Feedback

//  Here’s precise feedback on each answer.

//? 1. qSafe vs q
//  Verdict: Incorrect.
//  Why: `qSafe` is for optional/conditional elements where you do not want an error if the element is missing (it returns `null`). Use `q`/`byId` for required elements where a missing node should fail-fast with a clear error.
//  Rule of thumb: Required → `q`/`byId`; Optional → `qSafe` (+ optional chaining).

```js
const notice = qSafe('[data-ui="notice"]');
notice?.classList.add('hidden'); // safe no-op if null
```

//? 2. Scoping with a root
//  Verdict: Correct.
//  Why: It avoids selector collisions and ensures component isolation. Bonus benefits: better testability (operate on a container fixture), portability (component works wherever it’s mounted), and fewer accidental global matches.

//? 3. textContent vs innerHTML
//  Verdict: Correct (good reasoning).
//  Why: `textContent` inserts plain text (no HTML parsing), preventing script injection. Use `innerHTML` only for trusted markup or sanitized content.

//? 4. Cached references after replaceWith
//  Verdict: Correct, with a nuance.
//  Why: Your reference still points to the detached old node (`node.isConnected === false`). It won’t reflect the new DOM. Event listeners on the old node won’t fire; UI updates won’t show. Re-query for the new node or avoid wholesale replacement if you want to keep references stable.

```js
if (!btn.isConnected) {
    // stale reference → reselect
    const btnNew = q('[data-ui="card.cta"]', firstCard);
}
```

//? 5) Stretch (optional)
//  Create a tiny wrapper that returns a scoped API:

//  Usage:

import { inScope } from './single-scope.js';
import { addClass, addClassAny, ensureConnected, qSafe, setText } from './single.js';
const C1 = inScope(firstCard);
C1.setText(C1.q('[data-ui="card.title"]'), 'Router - West Wing');


//TODO Step 3 — Assessment & Feedback

//  This step validates understanding and gives you immediate, actionable feedback. Work through Parts A–E; use the provided answer keys and checks.

//? A) Concept check (short answers)
//  1. When do you prefer getElementById over querySelector, and why?
//  2. Define fail-fast vs fail-soft selection and give one use case for each.
//  3. Why is textContent the safe default for user-visible updates?
//  4. What does asHTMLElement(el) defend against? Give an example that would fail.
//  5. Explain why scoping queries with a root makes components more reliable.
//  6. What happens to cached references after element.replaceWith(newNode)?
//  7. When is innerHTML acceptable, and what must be true about its input?
//  8. Are classList operations guaranteed on SVG nodes in your helpers? Why or why not?

//! Answers
//  1. I prefer getElementById for unique anchors; it is explicit, fast, and communicates uniqueness. Use querySelector for CSS flexibility and scoping under a container.
//  2. Fail-fast (q/byId) throws if missing—use for required UI. Fail-soft (qSafe) returns null—use for optional UI you can omit without breaking.
//  3. The textContent inserts raw text (no HTML parsing), preventing script injection and layout surprises.
//  4. It ensures the only call HTMLElement-specific APIs. Example fail: passing an SVGElement to asHTMLElement (throws).
//  5. It avoids accidental global matches, improves portability/tests, and prevents collisions between components.
//  6. The reference keeps pointing to the detached old node (isConnected === false); must re-query to reach the new node.
//  7. Only for trusted/sanitized markup can fully control (e.g., static templates). Never pass unsanitized user input.
//  8. The helpers intentionally narrow to HTMLElement; addClass/removeClass/toggleClass call asHTMLElement, so using them on SVG would throw—even though many browsers expose classList on SVG. This is a deliberate safety trade-off.

//? B) Code reading & reasoning

//* Snippet 1

const status = q('[data-ui="status"]');
setHTML(status, '<strong>Online</strong>');

//  Question: Is this safe and appropriate here?
//  Answer: Acceptable if the string is trusted/controlled by me (it is). In general I prefer setText unless intentionally need markup.

//* Snippet 2

const secondCardTitle = q('[data-ui="card.title"]');        //  no root
setText(secondCardSubtitle, 'NAS - Media Vault');

//  Question: What’s the bug?
//  Answer: Unscoped query risks hitting the first match globally. Fix by scoping:

const secondCard = q('[data-ui="card"]:nth-of-type(2)', q('[data-ui="grid"]'));
const secondCardTitle = q('[data-ui="card.title"]', secondCard);

//* Snippet 3

const icon = q('svg[data-ui="icon"]');
addClass(icon, 'active');

//  Question: What happens?
//  Answer: addClass → asHTMLElement(icon) throws (icon is SVGElement). Either 
//      • (a) change helper to accept SVG for class ops or 
//      • (b) bypass the HTMLElement guard for SVG-specific handling.

//? C) Debugging exercise

//  Buggy

const banner = byId('banner');                              //  may be missing on some pages
setText(banner, 'Welcome!');
setStyle(banner, 'background-color', '#eff');

//  Fix (required vs optional)

const banner = qSafe('#banner');
if (banner) {
    setText(banner, 'Welcome!');
    setStyle(banner, 'background-color', '#eef');
}

//  Buggy (stale ref)

let cta = q('[data-ui="card.cta"]', q('[data-ui="card"]'));
cta.replaceWith(cta.cloneNode(true));
setText(cta, 'Clicked');

//  Fix (reselect after replacement)

//  after any operation that can replace nodes:
if (!cta.isConnected) {
    const firstCard = q('[data-ui="card"]');
    cta = q('[data-ui="card.cta"]', firstCard);
}
setText(cta, 'Clicked');


//? D) Mini-build with acceptance criteria

//  Task: Add a “connection quality” badge that updates safely.
//  1. HTML (inside .toolbar):

<span class="badge" data-ui="quality" aria-live='polite'>-</span>

//  2. JS (using helpers):

const quality = q('[data-ui="quality"]');                   //  required
function setQuality(level) {
    //  level: 'good' | 'ok' | 'bad'
    ['good', 'ok', 'bad'].forEach(cls => removeClass(quality,cls));
    addClass(quality, level);
    setText(quality, level === 'good' ? 'Good' : level === 'ok' ? 'OK' : 'Bad');
    setAttr(quality, 'data-level', level); 
}

//  3. Acceptance criteria (must pass):
//      • Throws a clear error on startup if the badge is removed.
//      • Only one of good|ok|bad classes can be present at a time.
//      • Text and data-level attribute stay in sync.
//      • Switching level 100 times does not leak errors or leave stale classes.

//? E) Quick automated checks (paste in console)
//  Assumes your helpers are imported as in Step 2 and the DOM from Step 2 is present.

(function () {
    const results = [];
    const pass = (name) => results.push({ name, ok: true });
    const fail = (name, e) => results.push({ name, ok: false, msg: e?.message || e });

    // 1) Fail-fast throws
    try { q('[data-ui="nope"]'); fail('fail-fast throws on missing', 'No error thrown'); }
    catch { pass('fail-fast throws on missing'); }

    // 2) Fail-soft returns null
    const maybe = qSafe('[data-ui="nope"]');
    if (maybe === null) pass('fail-soft returns null'); else fail('fail-soft returns null', 'Not null');

    // 3) Scoping isolates nodes
    const grid = q('[data-ui="grid"]');
    const firstCard = q('[data-ui="card"]', grid);
    const secondCard = q('[data-ui="card"]:nth-of-type(2)', grid);
    const t1 = q('[data-ui="card.title"]', firstCard);
    const t2 = q('[data-ui="card.title"]', secondCard);
    const oldT1 = t1.textContent;
    const oldT2 = t2.textContent;
    setText(t2, 'Scoped Title');
    if (t1.textContent === oldT1 && t2.textContent === 'Scoped Title') pass('scoping isolates nodes');
    else fail('scoping isolates nodes', 'Unexpected title change');

    // 4) HTMLElement guard
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svg);
    try { asHTMLElement(svg); fail('HTMLElement guard rejects SVG', 'No error thrown'); }
    catch { pass('HTMLElement guard rejects SVG'); }
    svg.remove();

    // 5) Style helper writes property
    const status = q('[data-ui="status"]');
    setStyle(status, 'letterSpacing', '1px');
    if (getComputedStyle(status).letterSpacing) pass('setStyle applies style'); else fail('setStyle applies style', 'No letterSpacing');

    // Report
    const ok = results.filter(r => r.ok).length;
    const total = results.length;
    console.table(results);
    console.log(`Passed ${ok}/${total} checks`);
})();

//  Expected: All checks pass; the table shows green across the board.


//? F) Feedback rubric (target: “Proficient” or higher)
//      • Accuracy
//          • Proficient: Correctly distinguishes fail-fast/soft, scopes queries consistently, uses textContent by default.
//      • Safety
//          • Proficient: No unsafe innerHTML; guards non-HTMLElement usage; optional elements handled via qSafe.
//      • Design
//          • Proficient: Uses [data-*] hooks; clear, minimal selectors; concise error messages.
//      • Maintainability
//          • Proficient: Re-queries after potential node replacement; avoids brittle global lookups; keeps helpers small and focused.
//  If any criterion is below “Proficient,” rework the specific part and rerun the checks in Part E.

//? G) Personalized improvement tips
//      • Centralize all “required” selections at the top of the module; it makes startup failures immediate and obvious.
//      • Consider a separate helper for SVG (e.g., addClassAny(el, cls)) if your UI mixes HTML and SVG frequently.
//      • For dynamic UIs that re-render, wrap selections in functions (getCTA()) instead of caching references.


//TODO  Step 4 — Reflection & Journal

//  Use this structured reflection to consolidate the “single element” patterns and surface any blind spots. Capture your answers in your study journal (Markdown/Notion/Obsidian—anything you’ll revisit).

//? 1) Feynman recap (concise teaching)
//  Explain the lesson to a beginner in 5 sentences max. Avoid jargon; if a technical word is necessary, define it in-line.
//  • What is a “single element” helper and why it exists.
//  • When to use q/byId (fail-fast) vs qSafe (fail-soft).
//  • Why scoping with a root prevents bugs.
//  • Why textContent is the safe default; when innerHTML is acceptable.
//  • What happens to cached references when nodes are replaced.
//  Write it now in your journal. Rate your clarity 1–5 (how confident you’d be teaching it to a peer).

//! Answer

//  • A "single element" helper is a utility function designed to select and interact with a single DOM element, often simplifying code and reducing errors by ensuring only one match is expected. 
//  • Using q/byId (fail-fast) is appropriate when I expect the element to always exist and want an immediate error if it does not, while qSafe (fail-soft) is safer when absence is a valid scenario and you wish to avoid exceptions.
///  • Scoping with a root element prevents bugs by ensuring queries are confined to a specific subtree, avoiding unintended matches elsewhere in the page and increasing code predictability. 
//  • The textContent is the safe default for modifying element contents because it treats the input as plain text, preventing HTML injection, while innerHTML should only be used for inserting HTML markup and after careful content sanitization to avoid security risks like XSS. 
//  • When nodes are replaced in the DOM, cached references to those old nodes become stale and will not point to the new elements, potentially leading to bugs if they are accessed or manipulated afterward.

//? 2) Personal “rules of thumb”
//  Turn concepts into crisp rules you’ll actually remember in the editor.

//# My Single-Element Rules (v1)
//  • Required element? Use q()/byId(); crash early with a clear message.
//  • Optional element? Use qSafe() + optional chaining.
//  • Always scope queries to a container when inside a component.
//  • Default to setText()/attributes; avoid innerHTML unless markup is trusted.
//  • Re-select after operations that may replace nodes (diffing, templating, .replaceWith()).

//  Add two more rules specific to how you code (e.g., naming of [data-ui] hooks, where you place required selections).

//! Solution

//* 1. The [data-ui] hooks use a naming convention where the attribute starts with "data-ui" followed by a descriptive, lowercase, hyphen-separated name to uniquely identify UI elements. 
//* 2. Required selections using these hooks are placed directly on the HTML elements to which the JavaScript or CSS needs to bind or interact, enabling safe and clear targeting without conflicts with other attributes or libraries.

//? 3) Gotchas & anti-patterns (make it personal)
//  Reflect on anything that tripped you up in Steps 1–3.
//  • Where did you reach for a global query when you should have scoped?
//  • Did you ever set innerHTML out of habit? Why?
//  • Did you catch an SVG/HTMLElement mismatch? How will you prevent it next time?
//  Document one concrete change you will make (e.g., “Add // REQUIRED: comments at the top of modules and group all fail-fast selections there.”).

//! Answer

//  1. As developer I mistakenly reach for a global query, such as document.querySelector('[data-ui="card"]'), instead of scoping to a specific parent, when aiming for quick access or out of habit, but this reduces performance and risks selecting unintended elements.
//  2. As a developer I set an innerHTML out of habit because customizing the environment to fit personal workflow increases efficiency and comfort, making daily tasks more predictable. This habit also stems from past experiences, where proven configurations help avoid errors and maintain consistency across projects and tools. 
//  3. I did not catch an SVG/HTMLElement mismatch in my code. This problem probably will appear in the future development projects.

//? 4) Error messages that help you debug
//  Good fail-fast only works if messages are actionable. Draft your standardized wording:

//  q(): selector not found -> [selector]                                       //  The query selector was not found in the DOM, making it easy to verify the exact string passed and spot typos or logic errors.
//  byId(): #id not found -> [id]                                               //  The element with the specified ID was not found, showing you precisely which ID is missing or incorrect.
//  asHTMLElement(): expected HTMLElement, got [actual]                         The value given could not be treated as an HTMLElement, so you can check the data type passed in your code.

//  Add 1–2 more messages you want (e.g., for prohibited innerHTML in untrusted flows).

//! Solution

//  1. innerHTML blocked: untrusted content in [element]                        //  Setting innerHTML is denied for this element because the source is untrusted — helps prevent security risks like XSS in untrusted flows.
//  2. setProps(): invalid property [property] on [element]                     //  Attempted to set a property not valid for the given element, aiding in identifying typos or unsupported properties at a glance.

//? 5) Review checklist (use before running code)
//  Convert today’s ideas into a quick pre-run checklist.

//  [ ] All required nodes selected with q()/byId() at the top.
//  [ ] Optional nodes selected with qSafe(); guarded with ?. usage.
//  [ ] All queries scoped to a container when inside a component.
//  [ ] Only setText()/setAttr()/classList used for user content; innerHTML only with trusted markup.
//  [ ] No stale references after any node replacement paths.
//  [ ] Clear, consistent error messages (copy/paste templates).

//! Solution

//  The checklist order matches best practice recommendations for DOM manipulation and UI safety. The top-to-bottom progression reflects the logical flow when preparing and reviewing DOM code:
//  • Begin with all required and optional node selection, since we need nodes available before any actions.
//  • Ensure queries are properly scoped to avoid accidental global DOM or cross-component access.
//  • Only then, move on to content rendering—explicitly limiting risky operations like innerHTML for untrusted content, which is a key security step.
//  • After making updates, review for the risk of stale references, especially following dynamic DOM changes.
//  • Finally, ensure error messages are clear and consistent throughout, supporting rapid debugging.
//  This ordering aligns with modern performance and safety guidelines commonly found in top web development resources, promoting robust, maintainable, and secure codebases.

//? 6) Mini retrospective (evidence-based)
//  Answer briefly and concretely:
//  • One bug this approach would have prevented in your past work.
//  • One test you would write now (e.g., “removing notice does not crash the toolbar”).
//  • One metric to watch (e.g., “number of global queries in component code should be 0”).
//  • One example in your codebase to refactor tomorrow using these helpers.

//! Solution

//  1. One bug I faced in my past work was to miss the () in the ${d.toLocaleTimeString()} which led to bad error in my code.
//  2. One test I would write now is: ‘selecting the main submit button using its unique data attribute works as expected.’ This test would use a selector like [data-cy="submit-btn"] to find the button and then assert that clicking it triggers the correct action, ensuring users (and tests) can always interact with the intended element even if the DOM changes.
//  3. One metric to watch for DOM selectors—single element—is “number of global queries in component code should be 0.” This ensures that all DOM selections are as specific as possible, improving test reliability and performance by avoiding unintended matches and preventing fragile tests caused by broad selectors.
//  4. Refactor all instances where buttons are selected with a generic query like document.querySelector('button') to use a more specific selector, such as document.querySelector('[data-cy="submit-btn"]'). This will ensure that tests are less likely to break if new buttons are added or the DOM structure changes, making the selection more robust and maintainable.

const refreshButton = document.querySelector('[data-ui="refresh"]');

refreshButton.addEventListener('click', function() {
    alert('Refresh button clicked!');
});

//? 7) Transfer to your active projects
//  Map the lesson to two ongoing builds to ensure immediate application.
//  • Social Space header: Identify the component root (<header> or container div). List which subparts are required (logo, primary nav) vs optional (promo badge). Decide selectors ([data-ui="nav"], [data-ui="badge"]) and note where you will use q vs qSafe.
//  • Travel App panel: Choose a card container as scope. Enumerate the single elements you will mutate (title, price, “save” button). Specify how you will avoid stale refs if cards re-render (e.g., re-query in event handlers or expose getEl() functions instead of caching).
//  Write these as two short checklists in your journal.

//! Answer

//  1. Social Space header: To create a responsive header for a project we need to identify the correct components for. We can start with "header" element or a generic container "div" for flexibility that will include an id or class of header. The direct subordinate sections can include a logo, site title, search bar/form, primary nav, contact info, social media icons, language switcher, light/dark button, shopping cart icon, sign in option, or settings button. Depends on the project type or complexity of the project we can include divers options. Select the navigation section with [data-ui="nav"] and the badge with [data-ui="badge"], using q for direct, static selector queries while reserving qSafe for scenarios where selector values might come from dynamic or user-provided sources to avoid injection risks and ensure robust, secure DOM access.
//  2. For the Travel App panel, scope all DOM mutations within a card container element and mutate only the single card elements such as the title, price, and “save” button directly inside each card; to avoid stale references if cards re-render or reorder, always re-query these element selectors within event handlers or expose a function like getEl() that fetches current elements on demand, rather than caching references, ensuring your operations always interact with the latest DOM nodes.

//? 8) Confidence & gap scan
//  Rate 1–5 for each; add a one-line plan if <4.
//  • Selecting with scope
//  • Distinguishing fail-fast/soft
//  • Safe text vs HTML
//  • Handling stale references
//  • SVG vs HTMLElement boundaries
//  Example plan: “3/5 on stale refs → I’ll write a small util ensureConnected(el, reselectFn) to re-query when needed.”

//! Answer

//  1. Selecting with scope: 5/5 – Confident in scoping DOM queries to parent/card/container elements to avoid selecting unintended nodes, ensuring precise operations.
//  2. Distinguishing fail-fast/soft: 4/5 – Generally confident, but to further improve, will standardize using utility functions that throw on not-found (fail-fast) or safely no-op (soft) to clarify intent in different situations.
//  3. Safe text vs HTML: 5/5 – Fully confident in always using textContent for user or dynamic data to prevent XSS, only using innerHTML when working exclusively with trusted, static markup.
//  4. Handling stale references: 3/5 – Sometimes references get stale on re-renders; plan is to implement or use a utility like ensureConnected(el, reselectFn) or rely on on-demand queries to always fetch current DOM nodes in event handlers.
//  5. SVG vs HTMLElement boundaries: 4/5 – Usually careful, but will add a strict check when traversing/mutating children to ensure the code branches appropriately for either SVG or HTML elements, preventing type mismatches or invalid attribute handling.

//? 9) Commit log simulation (forces clarity)
//  Draft a pretend commit message that captures the change you would make after this lesson.

//  feat(ui): add single-element helpers and scoped selection in toolbar
//  • use q()/qSafe() for required/optional elements
//  • scope queries to [data-ui="toolbar"] container
//  • replace innerHTML with setText for status badge
//  • add actionable errors for missing selectors

//  Keep it around; use as a template for real commits.

//! Solution

//  feat(toolbar): enhance single-element DOM selection and error reporting
//  1. Introduce q() and qSafe() helpers for required and optional single-element selection in toolbar
//  2. All queries now scoped within [data-ui="toolbar"] for better encapsulation
//  3. Replace direct innerHTML updates with setText for safer status badge updates
//  4. Implement actionable errors when required selectors are missing for improved debugging

//  Commit Example
//  [type](optional content): [subject]
//  [optional body]

//? 10) Parking lot (questions to resolve later)
//  If any concept still feels fuzzy, park it explicitly:
//  • Do I want a parallel helper for SVG (class ops only)?
//  • Should I codify a project-wide naming convention for [data-ui]?
//  • Where will I centralize error message strings?

//! Answer

//  1. A parallel helper for SVG class operations is valuable because SVG elements use different attribute methods (setAttribute, getAttribute) for classes rather than classList used by HTMLElements; extending or building helper functions for add/remove/toggle class on SVGs avoids code duplication and reduces errors when manipulating SVGs programmatically.
//  2. Codifying a project-wide naming convention for [data-ui] attributes is beneficial for consistency, discoverability, and maintainability; establishing structured, semantic naming rules helps standardize selectors and communicate component roles clearly across the codebase.
//  3. Centralizing error message strings in a dedicated module or constants file is recommended to ensure consistency, ease of localization, and simpler updates; this approach avoids duplication and fosters a single source of truth for UI messaging or debugging outputs.


//TODO  Step 5 — Exercises & Practice

//  Use the same project from Step 2 (index.html, single.js, main.js). Each exercise has a task, acceptance criteria, and a brief hint. A quick auto-check harness is provided at the end.

//? Exercise A — Required vs Optional (fail-fast vs fail-soft)

//* Task: Convert three sections so that truly required elements fail-fast and nice-to-have elements fail-soft.
//  • Make [data-ui="title"] and [data-ui="status"] required.
//  • Make [data-ui="notice"] optional.

//  Acceptance criteria:
//  1. Removing title or status from HTML throws a clear error (from q).
//  2. Removing notice does not crash; all that uses it accounts for null.

//* Hint: Use q() for required and qSafe() + optional chaining for optional.

//! Solution

const title = q('[data-ui="title"]');
const status = q('[data-ui="status"]');
const notice = qSafe('[data-ui="notice"]');

notice?.classList.remove('hidden');

const btnToggle = q('[data-ui="toggle"]');
btnToggle.addEventListener('click', () => {
    if (!notice) return;
    notice.classList.btnToggle('hidden');
})

//? Exercise B — Scoped Single-Element Ops (component isolation)

//* Task: Inside the grid, update only the second card:
//  • Change the title to "NAS - Backups".
//  • Change the subtitle to append " • Uptime: 7d".
//  • Change the CTA button next to "Run Backup".

//* Acceptance criteria: Only the second card  changes. The first (and any others) remain untouched.
//* Hint: Select the grid, then the :nth-of-type(2) card, then query children using that card as the root.

//! Solution

const title = q('[data-ui="title"]');
setText(title, 'NAS - Backups');

const subtitle = q('[data-ui="subtitle"]')
subtitle.textContent = " • Uptime: 7d";
document.body.append(subtitle);

const btn = q('[data-ui="card.cta"]');
setText(btn, 'Run Backup')

//! Feedback

// Scope to grid → second card → then query children inside that card
const grid = q('[data-ui="grid"]');
const secondCard = q('[data-ui="card"]:nth-of-type(2)', grid);

//  Title
const titleEl = q('[data-ui="card.title"]', secondCard);
setText(titleEl, 'NAS - Backups');                          // em dash is optional stylistically

// Subtitle: append uptime, keep existing IP
const subtitleEl = q('[data-ui="card.subtitle"]', secondCard);
const current = subtitle.textContent.trim();
if (!current.includes('Uptime: 7d')) {
    setText(subtitleEl, `${current} • Uptime: 7d`);
}

//  CTA button
const btnEl = q('[data-ui="card.cta"]', secondCard);
setText(btnEl, 'Run Backup');

//  Quick acceptance checks
//  • First card’s title/subtitle/CTA remain unchanged.
//  • Second card shows NAS — Backups, subtitle ends with • Uptime: 7d, and CTA reads Run Backup.
//  • No elements are moved in the DOM.

//? Exercise C — Uniqueness Guard (only())

//* Task: Add a helper to single.js that enforces exactly one match for a selector under a root.

//  single.js
//  Use it to ensure there is exactly one status badge in the toolbar.

//* Acceptance criteria:
//  1. Duplicating the status element causes a clear, actionable error at startup.
//  2. Removing it also fails fast.
//  3. With exactly one, the page runs normally.

//* Hint: Replace q('[data-ui="status"]') with only('[data-ui="status"]', toolbar)

//! Solution





//? Exercise D — Safe Text & ARIA Sync

//* Task: Implement a "Toggle Notice" button that correctly mirrors state to ARIA attributes:
//  • Clicking [data-ui="toggle"] show/hide the optional notice.
//  • Reflect state on the button via aria-pressed="true|false".
//  • If notice is missing (optional), the handler should be a safe no-op.

//* Acceptance criteria:
//  1. Button's aria-pressed always matches visibility state.
//  2. No errors if notice is absent.
//  3. No innerHTML is used to change the label; use setText.

//* Hint: Compute the next state first, update classes/attributes second.

//! Solution






//? Exercise E — Stale Reference Guard (ensureConnected())

//* Task: Add a helper that re-selects an element if the reference is stale (detached from DOM).

//  single.js
//  Simulate re-rendering the first card CTA (e.g., replaceWith) and then use ensureConnected before updating text.

//* Acceptance criteria:
//  1. After replacement, your code updates the new button successfully.
//  2. No operations are performed on detached nodes (isConnected === false).

//* Hint: Wrap any CTA usages inside a function that calls ensureConnected.

//! Solution







//? Exercise F — SVG Edge (select ≠ HTMLElement)

//* Task: Add an inline SVG icon somewhere in the toolbar and attempt to call addClass(icon, 'active'). Then adjust your code so SVG is handled safely without weakening asHTMLElement.

//  Approach A (recommended): add a separate helper that accepts any Element for class ops:

//  single.js

//* Acceptance criteria:
//  1. Calling addClass(icon, 'active') throws (by design).
//  2. Calling addClassAny(icon, 'active') works on the SVG icon.
//  3. Existing HTML flows remain guarded by asHTMLElement.

//* Hint: Keep HTML and SVH paths distinct so you do not silently bypass safety.

//! Solution

export function addClassAny(el, cls) { el.classList.add(cls); }
export function removeClassAny(el, cls) { el.classList.remove(cls); }
export function toggleClassAny(el, cls, force) { el.classList.toggle(cls, force); }


//* Optional stretch goals
//  • Typed overloads (TS): create TypeScript typings that narrow q return types where possible.
//  • Scope factory: build an inScope(root) wrapper (from Step 2 stretch) and convert your grid logic to use it.
//  • Diagnostics flag: add an env-style toggle to prefix all thrown messages with the module name, e.g., [single].

//TODO  Step 6 — Project Integration

//  Objective: wire the “single element” patterns into your real components so they are safer, easier to maintain, and ready for later refactors.

//? A) Component pattern (drop-in template)

//  Use this template for any widget with a single root. It scopes queries, separates init, state updates, and destroy, and keeps fail-fast vs fail-soft explicit.
//  Boot it from main.js:


//? B) Apply to your two active builds

//* 1) Social Space — Header
//  Goal: robust, scoped header with optional promo badge and aria-correct menu toggle.
//  Selectors (data-ui):
//  • Required: header root, [data-ui="logo"], [data-ui="nav"], [data-ui="menu.toggle"]
//  • Optional: [data-ui="promo"], [data-ui="count"]
//  Integration sketch:

//* Acceptance checks:
//  • Removing [data-ui="promo"] doesn’t crash.
//  • aria-expanded on the button always matches .is-open on the nav.
//  • Only header elements change; nothing outside the header is touched.

//* 2) Travel App — Stay Card
//  Goal: single card controller that survives re-renders.
//  HTML hooks (inside a card):
//  [data-ui="card.title"], [data-ui="card.price"], [data-ui="card.cta"].
//  Component:

//* Acceptance checks:
//  • After replacing the CTA via replaceWith, disableCTA() still updates the new button.
//  • Prices always update both text and data-value.

//? C) Boot order & error boundaries
//  1. Select page anchors first (fail-fast): app root, main regions.
//  2. Create components, each performing their own required/optional checks.
//  3. Wire events only after successful creation.
//  4. Guard optional cross-component links with qSafe.

try {
    // createToolbar(...); createHeader(...); etc.
} catch (e) {
    console.error('[boot] fatal:', e.message);
    // Optionally render a minimal fallback UI here.
}

//? D) Lightweight test plan (manual + console)
//  • Isolation: removing an optional element (promo/notice) does not crash.
//  • Scope: component changes do not affect siblings.
//  • A11y: button aria-* reflects state after each click.
//  • Stale refs: after replaceWith on CTA, controller methods still operate on the new node.

//  Console harness (paste once per component to sanity-check):



//? E) Refactor checklist (use it while integrating)
//  • Each component exports a factory createX(root) that returns an API.
//  • All selectors scoped to root. No global lookups inside components.
//  • Required → q/only; Optional → qSafe.
//  • setText for user strings; setHTML only for trusted markup.
//  • Any node that may be replaced is accessed via ensureConnected before use.
//  • Events cleaned up by a destroy() method (where relevant).

//? F) What to commit
//  • feat(toolbar): adopt single-element helpers; scoped queries; aria sync
//  • feat(header): componentize; optional promo; unread counter
//  • feat(stay-card): ensureConnected for CTA; price + data-value sync


//TODO  Step 7 — Exit Ticket

//  Use this to confirm mastery and lock in habits before moving on.

//? A) 60-second recap (say it aloud or jot it down)
//  • Required nodes use q()/byId() and fail fast with clear messages.
//  • Optional nodes use qSafe() and fail soft (null + guarded usage).
//  • Always scope queries to a component root.
//  • Default to setText/attributes; only use setHTML for trusted markup.
//  • Re-select after possible replacements with ensureConnected.
//  • Treat SVG as Element (use addClassAny/removeClassAny)—keep asHTMLElement strict for HTML flows.

//? B) Exit questions (short answers)
//  1. What specific signal tells you a reference is stale, and what’s your remedy?

//  2. Why is only(selector, root) safer than q(selector, root) for singletons? Give one example.

//  3. In a component, where should all required selections live and why?

//  4. When is it acceptable to call setHTML? Name one mitigation you’d apply.

//  5. How do you reflect a toggle’s visibility state for assistive tech?

//! Answer key (self-check):
//  1. !el.isConnected → call ensureConnected(el, reselectionFn).
//  2. It enforces uniqueness; startup fails if 0 or >1 matches (e.g., a single [data-ui="status"]).
//  3. At the top of the module/factory to fail early and surface actionable errors.
//  4. Only for trusted/sanitized markup you control; mitigate with strict inputs or a sanitizer.
//  5. Sync an ARIA state, e.g., aria-pressed="true|false" on the toggle, updated whenever visibility changes.

//? C) Code audit checklist (pass = all checked)
//  • All required nodes via q()/byId(); optional via qSafe() with guards.
//  • For singletons, only() is used (e.g., status badge).
//  • All queries scoped to a root (no global lookups inside components).
//  • No unsafe innerHTML for user data; setText used by default.
//  • Any node that may be replaced is accessed via ensureConnected.
//  • SVG handled with addClassAny/removeClassAny (HTML helpers remain guarded).

//? D) Auto-checks (paste in DevTools Console)
//  This script imports your helpers and verifies A–F behaviors against your current page.

//  Pass criterion: All checks pass or the only “skipped” one is the optional SVG test.

//? E) What to commit
//  • feat(single): finalize single-element helpers (q/qSafe/only/ensureConnected)
//  • feat(devices): enforce scoped selection; aria-synced toggle; stale-ref guard
//  • chore(dev): add console harness for exit checks

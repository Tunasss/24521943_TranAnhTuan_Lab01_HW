# TASK_DECOMPOSITION
 
Course: Web Application Development, Lab 1: Modern Web Foundations & AI-Assisted Engineering
Assignments: HW1 (Production Portfolio) and HW2 (Drum Kit Engine)
 
## 0. Overview
 
### Rules I must follow
- Every milestone is an **atomic commit** (one concern per commit, small diff).
- No monolithic PRs. One branch and one small PR per milestone.
- No one-shot AI-generated code. I write, run, and understand each step myself.
- `onclick=...` and any inline handler is **strictly banned**.
- HW2 is **contract-first**: the HTML contract is committed before any JavaScript.
- Live defense: the instructor changes a key binding and I must refactor in under 3 minutes.
### Planned commit order
| # | Task | Commit message |
|---|------|----------------|
| 0 | Plan | `docs: add task decomposition` |
| 1 | HW1 M1 | `fix(a11y): contrast & landmarks` |
| 2 | HW1 M2 | `fix(nav): keyboard trap prevention` |
| 3 | HW1 M3 | `security(csp): strict CSP, remove inline handlers` |
| 4 | HW1 M4 | `perf: optimize assets` |


### Git workflow for each task
1. `git checkout -b <branch>` from an up-to-date `main`.
2. Do the sub-steps below, running the verification each time.
3. Stage only files related to this task (`git add -p` when in doubt).
4. Commit with the exact required message.
5. Push, open a small PR that links this file's section, merge, delete the branch.
---
 
## HW1: Production Portfolio (minimum 4 commits)
 
### M1: WCAG 2.2 AA audit
- **Branch:** `feat/m1-a11y`
- **Goal:** the site meets WCAG 2.2 Level AA for color contrast and page structure (landmarks).
- **Files touched:** `index.html`, `css/style.css`
- **Sub-steps:**
  1. **Baseline.** Run Lighthouse (Accessibility) and the axe DevTools extension. Save a screenshot as `docs/evidence/m1-before.png` and list every issue found.
  2. **Contrast (SC 1.4.3, 1.4.11).** For every text/background pair, measure the ratio with the WebAIM Contrast Checker. Normal text needs >= 4.5:1; large text (>= 24px, or >= 18.66px bold) and UI component borders/icons need >= 3:1. Change color tokens in CSS until all pass. Record each pair and ratio.
  3. **Landmarks and structure (SC 1.3.1, 2.4.1).** Wrap content in `<header>`, `<nav aria-label="Main">`, exactly one `<main id="main">`, and `<footer>`. Use `<section>` with a heading for each portfolio part.
  4. **Document basics (SC 3.1.1, 2.4.2).** Set `<html lang="en">`, a unique meaningful `<title>`, exactly one `<h1>`, and heading levels without skipping (h1, h2, h3).
  5. **Skip link (SC 2.4.1).** Add `<a class="skip-link" href="#main">Skip to content</a>` as the first focusable element; style it so it becomes visible on focus.
  6. **Images and links (SC 1.1.1, 2.4.4).** Give every meaningful image a descriptive `alt`; decorative images get `alt=""`. Replace vague links like "click here" with descriptive text.
  7. **Target size (WCAG 2.2, SC 2.5.8).** Make every button and link at least 24x24 CSS px, with spacing between small targets.
  8. **Re-audit.** Run axe and Lighthouse again; save `docs/evidence/m1-after.png`.
- **Definition of done:**
  - axe DevTools reports 0 critical and 0 serious issues.
  - Lighthouse Accessibility score is 100.
  - Every color pair I use is documented with its ratio.
  - Exactly one `<main>`, one `<h1>`, and a working skip link.
- **Risks:** changing colors can break the visual design; adjust tokens (CSS variables) instead of editing many rules.
- **Commit:** `fix(a11y): contrast & landmarks`
### M2: Focus trap audit
- **Branch:** `feat/m2-focus`
- **Goal:** a keyboard-only user can reach every interactive element and can always leave it (WCAG SC 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 2.4.3 Focus Order, 2.4.7 Focus Visible, 2.4.11 Focus Not Obscured).
- **Files touched:** `index.html`, `css/style.css`, `js/main.js`
- **Sub-steps:**
  1. **Manual audit.** Put the mouse aside. Walk the entire page with Tab, Shift+Tab, Enter, Space, and Esc. Write down every place where focus disappears, jumps illogically, or gets stuck.
  2. **Visible focus.** Add a clear `:focus-visible` outline (>= 2px, contrast >= 3:1 against the background) to links, buttons, inputs, and custom controls. Never use `outline: none` without a replacement.
  3. **Tab order.** Remove any `tabindex` greater than 0. Use only `tabindex="0"` (to make custom widgets focusable) or `-1` (for programmatic focus). Make DOM order match visual order.
  4. **Menus and modals.** Open with a `<button>` (not a `<div>`). While open, focus moves inside; **Esc closes** it and focus returns to the trigger button. If it is a modal, Tab/Shift+Tab may cycle inside it, but Esc must always exit.
  5. **Sticky elements (SC 2.4.11).** Add `scroll-margin-top` / `scroll-padding-top` so a sticky header never covers the focused element.
  6. **Keyboard handlers.** Attach handlers with `addEventListener` in `js/main.js` only (no inline attributes).
  7. **Re-test.** Repeat step 1 completely, forward and backward.
- **Definition of done:**
  - I can traverse the whole page forward and backward with the keyboard only.
  - Focus is always visible and never hidden behind another element.
  - Every overlay closes with Esc and returns focus to its trigger.
  - No `tabindex` above 0 exists (`grep -rn 'tabindex="[1-9]' .` returns nothing).
- **Evidence:** short GIF `docs/evidence/m2-keyboard.gif` and a list of traps found and fixed.
- **Commit:** `fix(nav): keyboard trap prevention`
### M3: Strict CSP and zero inline handlers
- **Branch:** `feat/m3-csp`
- **Goal:** the page runs under a strict Content-Security-Policy with no inline JavaScript. `onclick=...` and similar attributes are banned.
- **Files touched:** `index.html`, `css/style.css`, `js/main.js`
- **Sub-steps:**
  1. **Inventory.** Search for inline handlers: `grep -rnE '\son[a-z]+\s*=' --include=*.html .`. List every match.
  2. **Move handlers.** For each match, give the element an `id` or `data-action`, delete the attribute, and register the listener in `js/main.js` with `addEventListener`.
  3. **Remove inline script and style.** Move every `<script>...</script>` body into `js/main.js` and load it with `<script src="js/main.js" defer>`. Move every `style="..."` into `css/style.css` as a class.
  4. **Add the CSP** in `<head>` as the first tag after `<meta charset>`:
```html
     <meta http-equiv="Content-Security-Policy"
       content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'self'">
```
     (GitHub Pages cannot set HTTP headers, so a meta tag is used. Note in the README that a real production server should send it as a header.)
  5. **Third-party resources.** Self-host fonts and libraries; avoid `'unsafe-inline'` and `'unsafe-eval'` completely.
  6. **Console check.** Open DevTools, reload with the cache disabled, and fix every "Refused to execute/load..." message.
  7. **Regression test.** Click and tab through every feature to confirm nothing broke.
  8. **Re-run the inventory** search from step 1 to confirm 0 matches.
- **Definition of done:**
  - The regex search returns 0 matches for inline handlers, inline `<script>` bodies, and `style=` attributes.
  - The Console has zero CSP violations.
  - The site behaves exactly as before.
  - The CSP string contains no `unsafe-inline` or `unsafe-eval`.
- **Evidence:** search output showing 0 results, Console screenshot `docs/evidence/m3-console.png`, the final CSP string.
- **Commit:** `security(csp): strict CSP, remove inline handlers`
### M4: Lighthouse 100
- **Branch:** `feat/m4-perf`
- **Goal:** Lighthouse scores 100 in Performance, Accessibility, Best Practices, and SEO.
- **Files touched:** `index.html`, `css/`, `js/`, `assets/`
- **Sub-steps:**
  1. **Baseline.** Run Lighthouse in an Incognito window (no extensions), mobile mode. Save the scores and the "Opportunities" list.
  2. **Images.** Convert to WebP/AVIF, resize to the largest displayed size, and add `width` and `height` attributes (prevents layout shift, CLS). Add `loading="lazy"` to below-the-fold images and `fetchpriority="high"` to the main hero image.
  3. **CSS/JS.** Minify both, remove unused rules, load scripts with `defer`, and avoid render-blocking resources.
  4. **Fonts.** Prefer system fonts or self-hosted WOFF2 with `font-display: swap`.
  5. **SEO basics.** Add `<title>`, `<meta name="description">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, and a canonical link if applicable.
  6. **Best practices.** Serve over HTTPS (GitHub Pages does), no console errors, no deprecated APIs.
  7. **Iterate.** Re-run Lighthouse after each change to see which one moved the score. Repeat until all four are 100.
- **Definition of done:**
  - All four Lighthouse categories show 100 (screenshot saved as `docs/evidence/m4-lighthouse.png`).
  - M1, M2, and M3 results are not broken (re-check axe and the Console).
- **Commit:** `perf: optimize assets`
---
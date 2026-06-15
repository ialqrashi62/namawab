# Accessibility Checklist — WCAG 2.2 AA
v1.0 — Owner: Frontend + UX — Audited each release

> Each item must pass before release. Use axe-core in CI + manual screen-reader spot-check.

## 1. Perceivable

### Text alternatives
- [ ] Every non-decorative image has meaningful `alt`.
- [ ] Decorative images use `alt=""` or CSS background.
- [ ] Icons paired with text or have `aria-label`.
- [ ] Charts/graphs have data-table fallback or summary text.

### Time-based media
- [ ] Training videos have AR + EN captions.
- [ ] Patient-facing videos have audio description option.

### Adaptable
- [ ] Semantic HTML: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.
- [ ] Headings in proper hierarchy (`<h1>` once per page, no skipped levels).
- [ ] Form fields have `<label for="...">`.
- [ ] Reading order makes sense without CSS.

### Distinguishable
- [ ] Color contrast ≥ 4.5:1 (normal text) and 3:1 (large text + UI components).
- [ ] No information conveyed by color alone (e.g., red=danger pairs with icon + text).
- [ ] Text resizable to 200% without loss of content/function.
- [ ] Reflow at 320×256 px (no horizontal scroll on small viewport).
- [ ] Audio with controls (no autoplay > 3 s).

## 2. Operable

### Keyboard
- [ ] All interactive elements reachable via Tab.
- [ ] No keyboard trap.
- [ ] Visible focus indicator (≥ 2px outline, 3:1 contrast vs background).
- [ ] Skip-to-content link first.
- [ ] Custom widgets (combobox, dialog) follow ARIA Authoring Practices.

### Enough time
- [ ] Session timeouts warn 1 min before; user can extend.
- [ ] No content moves/auto-updates faster than user can react (or pause control).

### Seizures
- [ ] No flashing content above 3 Hz.

### Navigable
- [ ] Page `<title>` describes purpose.
- [ ] Focus order matches visual order.
- [ ] Link text describes destination (no "click here").
- [ ] Multiple ways to find pages (nav + search + breadcrumb).

### Input modalities (2.2 additions)
- [ ] Drag operations have keyboard alternative (2.5.7).
- [ ] Targets ≥ 24×24 CSS px (2.5.8).
- [ ] Authentication doesn't require cognitive function tests (e.g., copy-paste images of text). Use OTP or biometric (3.3.8).
- [ ] Help available consistent location (3.2.6).

## 3. Understandable

### Readable
- [ ] `lang` attribute on `<html>`; switches with locale.
- [ ] Unusual medical terms have tooltip/glossary link.
- [ ] Plain language for patient-facing content (≤ 8th grade reading level when possible).

### Predictable
- [ ] Navigation consistent across pages.
- [ ] Components labeled consistently.
- [ ] No unexpected context changes on focus or input.

### Input assistance
- [ ] Required fields indicated.
- [ ] Errors identified clearly + how to fix.
- [ ] Suggestions offered after errors when available.
- [ ] Confirm before destructive actions.

## 4. Robust
- [ ] HTML validates.
- [ ] ARIA used only when semantic HTML insufficient; correct roles + states.
- [ ] Status messages use `aria-live` (e.g., toasts).

## Assistive tech testing
- [ ] NVDA + Firefox (Windows)
- [ ] JAWS + Chrome (Windows)
- [ ] VoiceOver + Safari (macOS, iOS)
- [ ] TalkBack + Chrome (Android)

## CI gates
- `axe-core` in unit + e2e: zero "serious" or "critical" violations to merge.
- Lighthouse a11y score ≥ 95 on critical pages.

## Monthly manual audit
- 5 random pages + 3 critical user flows.
- Findings tracked in JIRA with severity + due date.

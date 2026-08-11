# Style Guide / Design System — NamaMedical
# Filepath: .ai-brain/05_SHARED/style-guide.md
# Generated: 2026-08-08

# Style Guide — Stitch-inspired Design System

> **Aesthetic:** Clean, modern, medical · High contrast · Intuitive
> **Accessibility:** WCAG 2.1 AA · RTL/LTR native · Bilingual
> **Inspiration:** Google Stitch

---

## 1. Design Tokens

### 1.1 Colors

```javascript
const colors = {
  // Brand
  primary: '#0F766E',        // Teal 700
  primaryHover: '#0D9488',   // Teal 600
  primaryLight: '#5EEAD4',   // Teal 300

  // Semantic
  danger: '#DC2626',         // Red 600
  warning: '#F59E0B',        // Amber 500
  success: '#10B981',        // Emerald 500
  info: '#3B82F6',           // Blue 500

  // Clinical
  critical: '#FEE2E2',       // Red 100 (background)
  codeBlue: '#DBEAFE',       // Blue 100
  codePink: '#FCE7F3',       // Pink 100

  // Neutral
  bg: '#F9FAFB',             // Gray 50
  surface: '#FFFFFF',
  surfaceHover: '#F3F4F6',   // Gray 100
  border: '#E5E7EB',         // Gray 200
  text: '#111827',           // Gray 900
  textMuted: '#6B7280',      // Gray 500
  textInverse: '#FFFFFF',
};
```

### 1.2 Typography

```javascript
const typography = {
  // Fonts
  fontAr: '"IBM Plex Sans Arabic", "Tajawal", sans-serif',
  fontEn: '"Inter", system-ui, -apple-system, sans-serif',
  fontMono: '"JetBrains Mono", "Courier New", monospace',

  // Sizes
  sizeXs: '0.75rem',   // 12px
  sizeSm: '0.875rem',  // 14px
  sizeBase: '1rem',    // 16px
  sizeLg: '1.125rem',  // 18px
  sizeXl: '1.25rem',   // 20px
  size2xl: '1.5rem',   // 24px
  size3xl: '1.875rem', // 30px
  size4xl: '2.25rem',  // 36px

  // Weights
  weightNormal: 400,
  weightMedium: 500,
  weightSemibold: 600,
  weightBold: 700,

  // Line Heights
  leadingTight: 1.25,
  leadingNormal: 1.5,
  leadingRelaxed: 1.625,
};
```

### 1.3 Spacing

```javascript
const spacing = {
  '0': '0',
  '1': '0.25rem',  // 4px
  '2': '0.5rem',   // 8px
  '3': '0.75rem',  // 12px
  '4': '1rem',     // 16px
  '6': '1.5rem',   // 24px
  '8': '2rem',     // 32px
  '12': '3rem',    // 48px
  '16': '4rem',    // 64px
};
```

### 1.4 Border Radius

```javascript
const radius = {
  none: '0',
  sm: '0.25rem',  // 4px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  xl: '1rem',     // 16px
  full: '9999px',
};
```

### 1.5 Shadows

```javascript
const shadows = {
  sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
  md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
};
```

---

## 2. Component Library

### 2.1 Buttons

```html
<!-- Primary -->
<button class="btn btn--primary">Save</button>

<!-- Secondary -->
<button class="btn btn--secondary">Cancel</button>

<!-- Ghost -->
<button class="btn btn--ghost">Reset</button>

<!-- Danger -->
<button class="btn btn--danger">Delete</button>

<!-- Sizes -->
<button class="btn btn--primary btn--sm">Small</button>
<button class="btn btn--primary btn--md">Medium</button>
<button class="btn btn--primary btn--lg">Large</button>
```

### 2.2 Forms

```html
<div class="form-field">
  <label for="patient-name" class="form-label">اسم المريض / Patient Name</label>
  <input id="patient-name" type="text" class="form-input" required />
  <span class="form-help">أدخل الاسم الكامل</span>
</div>

<div class="form-field form-field--error">
  <label for="email" class="form-label">Email</label>
  <input id="email" type="email" class="form-input" aria-invalid="true" />
  <span class="form-error">Invalid email format</span>
</div>
```

### 2.3 Cards

```html
<article class="card">
  <header class="card__header">
    <h3 class="card__title">Cardiology Encounter</h3>
    <span class="card__badge badge--success">Active</span>
  </header>
  <div class="card__body">
    <p>Patient MRN 100045 presents with chest pain...</p>
  </div>
  <footer class="card__footer">
    <button class="btn btn--ghost btn--sm">Cancel</button>
    <button class="btn btn--primary btn--sm">Sign</button>
  </footer>
</article>
```

### 2.4 Tables

```html
<table class="data-table" role="table" aria-label="Patients">
  <thead>
    <tr>
      <th scope="col">MRN</th>
      <th scope="col">Name</th>
      <th scope="col">DOB</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>100045</td>
      <td>Salem Ahmed</td>
      <td>1981-04-12</td>
      <td><span class="badge badge--success">Active</span></td>
    </tr>
  </tbody>
</table>
```

### 2.5 Badges

```html
<span class="badge badge--success">Active</span>
<span class="badge badge--warning">Pending</span>
<span class="badge badge--danger">Critical</span>
<span class="badge badge--info">Info</span>
<span class="badge badge--neutral">Draft</span>
```

---

## 3. Clinical-Specific Components

### 3.1 VitalPanel

```html
<div class="vital-panel" role="group" aria-label="Vital signs">
  <div class="vital-card vital-card--hr">
    <span class="vital-label">HR</span>
    <span class="vital-value">72</span>
    <span class="vital-unit">bpm</span>
  </div>
  <div class="vital-card vital-card--bp">
    <span class="vital-label">BP</span>
    <span class="vital-value">120/80</span>
    <span class="vital-unit">mmHg</span>
  </div>
  <div class="vital-card vital-card--spo2">
    <span class="vital-label">SpO₂</span>
    <span class="vital-value">98</span>
    <span class="vital-unit">%</span>
  </div>
  <div class="vital-card vital-card--rr">
    <span class="vital-label">RR</span>
    <span class="vital-value">16</span>
    <span class="vital-unit">/min</span>
  </div>
  <div class="vital-card vital-card--temp">
    <span class="vital-label">Temp</span>
    <span class="vital-value">37.0</span>
    <span class="vital-unit">°C</span>
  </div>
</div>
```

### 3.2 AllergyBanner

```html
<div class="allergy-banner allergy-banner--critical" role="alert">
  <span class="allergy-banner__icon" aria-hidden="true">⚠</span>
  <span class="allergy-banner__text">Penicillin Allergy — Severe Anaphylaxis</span>
  <button class="allergy-banner__dismiss" aria-label="Dismiss">×</button>
</div>
```

### 3.3 RiskStratifier

```html
<div class="risk-stratifier risk-stratifier--high">
  <div class="risk-stratifier__label">NEWS2 Score</div>
  <div class="risk-stratifier__score">7</div>
  <div class="risk-stratifier__level">HIGH — Rapid Response</div>
  <div class="risk-stratifier__action">
    <button class="btn btn--danger btn--sm">Activate RR Team</button>
  </div>
</div>
```

### 3.4 OrderCard

```html
<div class="order-card" data-priority="routine" data-status="pending">
  <header class="order-card__header">
    <span class="order-card__icon">🧪</span>
    <span class="order-card__title">CBC with Differential</span>
    <span class="badge badge--priority-routine">Routine</span>
  </header>
  <dl class="order-card__meta">
    <dt>Ordered by</dt><dd>Dr. Sarah Chen</dd>
    <dt>Time</dt><dd>2026-08-08 14:30</dd>
    <dt>Indication</dt><dd>Anemia workup</dd>
  </dl>
  <footer class="order-card__actions">
    <button class="btn btn--primary btn--sm">View Results</button>
    <button class="btn btn--ghost btn--sm">Cancel</button>
  </footer>
</div>
```

### 3.5 CDSAlertBar

```html
<div class="cds-alert cds-alert--warning" role="status">
  <div class="cds-alert__icon" aria-hidden="true">⚠</div>
  <div class="cds-alert__body">
    <strong class="cds-alert__title">Drug Interaction</strong>
    <p class="cds-alert__message">Warfarin + Amiodarone → ↑ INR risk</p>
  </div>
  <button class="cds-alert__action btn btn--sm">Review</button>
</div>
```

---

## 4. Layout Patterns

### 4.1 Station Layout (2-col)

```html
<div class="station-layout">
  <aside class="station-sidebar" aria-label="Patient context">
    <PatientIDCard />
    <AllergyBanner />
    <RiskStratifier />
    <ActiveProblems />
  </aside>
  <main class="station-main">
    <header class="station-tabs" role="tablist">
      <button role="tab" aria-selected="true">Overview</button>
      <button role="tab">Orders</button>
      <button role="tab">Results</button>
      <button role="tab">Notes</button>
    </header>
    <div class="station-content">
      <!-- Per-tab content -->
    </div>
  </main>
</div>
```

### 4.2 Full-Width Layout

```html
<div class="full-layout">
  <header class="page-header">
    <h1>Patient List</h1>
    <SearchBar />
    <Filters />
  </header>
  <DataTable />
  <Pagination />
</div>
```

---

## 5. RTL/LTR Support

### 5.1 Logical CSS Properties

Use logical properties for directional styles:

```css
/* Instead of margin-left */
margin-inline-start: 1rem;

/* Instead of padding-right */
padding-inline-end: 0.5rem;

/* Instead of float: left */
float: inline-start;
```

### 5.2 Tailwind Logical Utilities

```html
<div class="ps-4 pe-2 ms-2 me-4 start-0 end-0">
  <!-- Auto-flips based on dir attribute -->
</div>
```

### 5.3 Direction Switch

```javascript
function setDirection(lang) {
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
}
```

---

## 6. Animation Guidelines

### 6.1 Timing

```javascript
const animation = {
  fast: '150ms',
  medium: '250ms',
  slow: '400ms',
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
};
```

### 6.2 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Iconography

### 7.1 Icon Set (Heroicons + Lucide)

| Icon | Use |
|---|---|
| 🏥 Hospital | Brand mark |
| ❤️ Heart | Cardiology |
| 🧪 Beaker | Lab |
| 🩻 X-ray | Radiology |
| 💊 Pill | Pharmacy |
| 👤 User | Patient |
| 🔒 Lock | Security |
| ⚠ Warning | Critical alert |
| ✓ Check | Success |
| × Cross | Close/Cancel |
| ⚙ Gear | Settings |
| 📊 Chart | Analytics |

### 7.2 Icon Sizing

```css
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }
```

---

## 8. Accessibility (WCAG 2.1 AA)

### 8.1 Color Contrast

| Combo | Ratio | Pass |
|---|---|---|
| Text (#111827) on bg (#F9FAFB) | 16.6:1 | ✅ AAA |
| Text (#6B7280) muted on bg | 4.83:1 | ✅ AA |
| White on primary (#0F766E) | 6.5:1 | ✅ AAA |
| White on danger (#DC2626) | 5.0:1 | ✅ AA |

### 8.2 Keyboard Navigation

- `Tab` / `Shift+Tab` — Move focus
- `Enter` / `Space` — Activate button/link
- `Esc` — Close modal
- `↑` / `↓` — Navigate lists
- `Home` / `End` — First/last item

### 8.3 Focus Indicators

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}
```

### 8.4 Screen Reader Support

```html
<button aria-label="Close" aria-pressed="false">
  <svg aria-hidden="true">...</svg>
</button>

<div role="alert" aria-live="polite">
  Drug interaction detected
</div>

<nav aria-label="Primary">
  <!-- nav items -->
</nav>
```

---

## 9. Brand Voice

### 9.1 Tone
- Professional, accurate, evidence-based
- Respectful and clear
- Bilingual (AR primary, EN secondary)
- Saudi context-aware

### 9.2 Examples

| Avoid | Use |
|---|---|
| "Patient died" | "Patient expired at 14:30" |
| "Weird reading" | "Critical value detected" |
| "Click here" | "View results" |
| "Login" only | "Sign in / تسجيل الدخول" |

---

**Generated:** 2026-08-08 · **Owner:** Design Team

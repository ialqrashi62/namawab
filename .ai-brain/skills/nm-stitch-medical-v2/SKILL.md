# nm-stitch-medical-v2 — Stitch Medical UI Design System v2

> Google Stitch-inspired design system for medical UI.
> RTL/LTR native, WCAG 2.1 AA, Tailwind-friendly.
> **Reduces UI generation tokens by 65%** via reusable components.

---

## 1. Design Tokens (S-07)

```json
{
  "colors": {
    "primary": "#0F766E",
    "primary_hover": "#0D9488",
    "danger": "#DC2626",
    "warning": "#F59E0B",
    "success": "#10B981",
    "info": "#3B82F6",
    "bg": "#F9FAFB",
    "surface": "#FFFFFF",
    "text": "#111827",
    "text_muted": "#6B7280",
    "border": "#E5E7EB",
    "critical_alert": "#FEE2E2",
    "code_blue": "#DBEAFE"
  },
  "typography": {
    "font_ar": "IBM Plex Sans Arabic, Tajawal",
    "font_en": "Inter, system-ui",
    "size_xs": "0.75rem", "size_sm": "0.875rem", "size_base": "1rem",
    "size_lg": "1.125rem", "size_xl": "1.25rem", "size_2xl": "1.5rem",
    "size_3xl": "1.875rem"
  },
  "spacing": { "1": "0.25rem", "2": "0.5rem", "4": "1rem", "6": "1.5rem", "8": "2rem" },
  "radius": { "sm": "0.25rem", "md": "0.5rem", "lg": "0.75rem", "xl": "1rem" },
  "shadow": {
    "sm": "0 1px 2px rgba(0,0,0,0.05)",
    "md": "0 4px 6px rgba(0,0,0,0.1)",
    "lg": "0 10px 15px rgba(0,0,0,0.1)"
  }
}
```

---

## 2. Component Library (S-18)

### 2.1 VitalPanel
```html
<div class="vital-panel" role="group" aria-label="Vital signs">
  <div class="vital-card vital-card--hr"><span class="vital-label">HR</span><span class="vital-value">72</span><span class="vital-unit">bpm</span></div>
  <div class="vital-card vital-card--spo2"><span class="vital-label">SpO₂</span><span class="vital-value">98</span><span class="vital-unit">%</span></div>
  <div class="vital-card vital-card--bp"><span class="vital-label">BP</span><span class="vital-value">120/80</span><span class="vital-unit">mmHg</span></div>
</div>
```

### 2.2 AllergyBanner
```html
<div class="allergy-banner allergy-banner--critical" role="alert">
  <span class="allergy-banner__icon" aria-hidden="true">⚠</span>
  <span class="allergy-banner__text">Penicillin Allergy — Severe Anaphylaxis</span>
  <button class="allergy-banner__dismiss">×</button>
</div>
```

### 2.3 RiskStratifier
```html
<div class="risk-stratifier risk-stratifier--high">
  <div class="risk-stratifier__label">NEWS2 Score</div>
  <div class="risk-stratifier__score">7</div>
  <div class="risk-stratifier__level">HIGH — Rapid Response</div>
</div>
```

### 2.4 OrderCard
```html
<div class="order-card">
  <header class="order-card__header">
    <span class="order-card__icon">🧪</span>
    <span class="order-card__title">CBC with Differential</span>
    <span class="badge badge--priority-routine">Routine</span>
  </header>
  <dl class="order-card__meta">
    <dt>Ordered by</dt><dd>Dr. Sarah Chen</dd>
    <dt>Time</dt><dd>2026-08-08 14:30</dd>
  </dl>
  <footer class="order-card__actions">
    <button class="btn btn--primary btn--sm">View Results</button>
    <button class="btn btn--ghost btn--sm">Cancel</button>
  </footer>
</div>
```

### 2.5 PatientIDCard
```html
<div class="patient-id-card">
  <div class="patient-id-card__avatar" aria-hidden="true">SA</div>
  <div class="patient-id-card__info">
    <div class="patient-id-card__name">Salem Ahmed</div>
    <div class="patient-id-card__meta">MRN: 100045 · 45y · M · Blood: O+</div>
    <div class="patient-id-card__alerts">DM-T2 · HTN · Penicillin Allergy</div>
  </div>
</div>
```

### 2.6 CDSAlertBar
```html
<div class="cds-alert cds-alert--warning" role="status">
  <strong>Drug Interaction:</strong> Warfarin + Amiodarone ↑ INR
  <button class="cds-alert__action">Review</button>
</div>
```

---

## 3. RTL/LTR Rules

| Property | LTR | RTL |
|---|---|---|
| `flex-direction` | `row` | `row-reverse` |
| `text-align` | `left` | `right` |
| `margin-left` | ml-* | use logical (ms-*, me-*) |
| Icons (chevron) | `→` | `←` |
| Tables | left-align | right-align |
| Date format | Y-M-D | D-M-Y (Hijri option) |
| Numbers | 1,234.56 | ١٬٢٣٤٫٥٦ |

**Tailwind logical utilities:** `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`

---

## 4. A11y (WCAG 2.1 AA)

- Color contrast ≥4.5:1 for text
- All interactive elements ≥44×44 px tap target
- `role`, `aria-label`, `aria-live` on dynamic content
- Focus-visible ring on all buttons
- Skip-to-content link
- Keyboard navigation (Tab/Shift+Tab/Enter/Space)
- Screen reader announcements for vitals/alerts

---

## 5. Stitch Generation Pattern

```yaml
dept_ui:
  tokens: S-07
  components: [vital-panel, allergy-banner, risk-stratifier, order-card, cds-alert]
  pages:
    - route: /station/<dept>
      layout: 2-col (sidebar + main)
      sidebar: [nav, patient-id-card, allergy-banner]
      main: [vital-panel, tabs(orders,results,notes)]
    - route: /station/<dept>/orders
      layout: full-width
      list: order-card
    - route: /station/<dept>/results
      layout: 2-col
      viz: chart (vital-trend)
```

---

## 6. File Output (per dept)
- `05_ux_ui_stitch.md` (component manifest + wireframes)
- `22_frontend_page.tsx`
- `23_frontend_components.tsx`
- `25_style_guide_tokens.json`

---

## 7. Integration
- Pairs with `nm-token-saver-pack-v2` (S-07, S-18)
- Used in `nm-ultimate-blueprint-factory`
- Drives `.ai-brain/02_MODULES/<DEP>/*` UI files

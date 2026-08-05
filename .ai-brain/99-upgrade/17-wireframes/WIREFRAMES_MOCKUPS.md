---
id: WIREFRAMES-MOCKUPS
version: 1.0
date: 2026-08-01
owner: PM
status: ACTIVE
---

# Wireframes & Mockups — Design System + Stitch Library + Per-dept Pages + Component Doc

> **Purpose:** Hi-fi wireframes for every key screen, generated via Google Stitch + design tokens. Storybook-equivalent component documentation.

---

## 1. Global systems comparison

| System | Design system |
|--------|----------------|
| **Epic** | Basquiat (in-house); Galaxy; ~50 design tokens |
| **Cerner** | Cerner Design System (Figma); designtokens |
| **MEDITECH** | Canvas Design System (Figma) |
| **athena** | athenaDS (Figma) |
| **Allscripts** | Allscripts DS |
| **InterSystems** | IrisDesigner |
| **Google Stitch** | generative AI UI |
| **NamaMedical** | **STITCH v2 (Google Stitch) + tokens + 4 pages per dept + Storybook-like doc** |

---

## 2. Google Stitch integration

Project: https://stitch.withgoogle.com/projects/17612425313712

For each new screen:
1. Sketch description prompt (use Stitch generation)
2. Export to Figma + HTML
3. Apply STITCH v2 tokens (override hardcoded)
4. Map to wireframe_v1 template
5. Add i18n keys (ar + en)
6. Safe-HTML wrappers (`escapeHTML`, `SafeHtml`)
7. Add to Storybook-like doc

---

## 3. Design Tokens (canonical)

```yaml
# .ai-brain/99-upgrade/17-wireframes/DESIGN_TOKENS.yaml
tokens:
  color:
    primary: { value: '#00A19A' }
    primary_hover: { value: '#008985' }
    primary_active: { value: '#007672' }
    bg: { value: '#F8F9FA' }
    surface: { value: '#FFFFFF' }
    surface_elevated: { value: '#FFFFFF', shadow: 'md' }
    text_primary: { value: '#212121' }
    text_secondary: { value: '#616161' }
    text_inverse: { value: '#FFFFFF' }
    border: { value: '#E0E0E0' }
    success: { value: '#2E7D32' }
    warning: { value: '#F57C00' }
    danger: { value: '#C62828' }
    info: { value: '#0277BD' }
    red_flag_bg: { value: '#FFEBEE' }
    red_flag_border: { value: '#C62828' }
  font:
    sans: { value: 'Tajawal, Inter, system-ui' }
    mono: { value: 'Cascadia Code, monospace' }
    size_xs: { value: '0.75rem' }
    size_sm: { value: '0.875rem' }
    size_base: { value: '1rem' }
    size_lg: { value: '1.125rem' }
    size_xl: { value: '1.25rem' }
    size_2xl: { value: '1.5rem' }
    size_3xl: { value: '1.875rem' }
  spacing:
    1: { value: '4px' }
    2: { value: '8px' }
    3: { value: '12px' }
    4: { value: '16px' }
    5: { value: '24px' }
    6: { value: '32px' }
    8: { value: '48px' }
    10: { value: '64px' }
  radius:
    sm: { value: '4px' }
    md: { value: '8px' }
    lg: { value: '16px' }
    full: { value: '9999px' }
  shadow:
    sm: { value: '0 1px 2px rgba(0,0,0,0.05)' }
    md: { value: '0 4px 12px rgba(0,0,0,0.08)' }
    lg: { value: '0 8px 24px rgba(0,0,0,0.12)' }
  motion:
    fast: { value: '120ms' }
    base: { value: '200ms' }
    slow: { value: '320ms' }
    easing: { value: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
```

Generated as:
- CSS variables: `tokens.css`
- Tailwind config
- React Native theme

---

## 4. Per-dept wireframes (4 pages × 100+ depts = ~400 pages)

For each dept, generate:
1. **Encounter summary** (patient chart)
2. **Order entry** (specialty-tailored)
3. **Results review** (lab/imaging related)
4. **AI conversational side panel**

Output: `wireframes/{DEPT}/page_{n}.{html,md}`

```html
<!-- Example: wireframes/CARD-001/page_1_encounter.html -->
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>لقاء قلبية - {{patient_name}}</title>
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="components.css">
</head>
<body class="bg-bg font-sans">
  <!-- Use safe-HTML for any dynamic content -->
  <header>...</header>
  <main>
    <section class="patient-header">...</section>
    <section class="vitals">...</section>
    <section class="orders">...</section>
    <aside class="ai-insights">...</aside>
  </main>
</body>
</html>
```

---

## 5. Component Documentation (Storybook-like)

Path: `.ai-brain/17-wireframes/components/`

Each component:
- Name + version
- Use case
- Variants (button sizes, table densities)
- States (default, hover, disabled, loading, error)
- Props / API
- ARIA roles
- i18n keys
- Code snippet (HTML or React)

Initial catalog (~40 components):
- Button (5 variants)
- Input, Select, MultiSelect, Combobox
- Dialog, Drawer, Sheet
- Tabs, Accordion
- Card, List, Table, DataGrid
- Badge, Chip, Tag
- Toast, Alert, Snackbar
- Avatar, Menu
- DatePicker, TimePicker
- FileUpload
- Charts (line, bar, donut, heatmap)
- Empty state
- Loading state
- Error state
- CommandPalette
- RedFlagBanner
- AllergyBanner
- Scribe (DAX-like panel)

---

## 6. Mockups (high-fi) — top 20 screens

Detailed HTML/CSS mockups:
1. Login + MFA
2. Provider schedule (today)
3. Provider inbox
4. Patient list (my patients)
5. Patient chart (encounter view)
6. Order entry
7. Lab results review
8. Imaging review with thumbnails
9. Note editor (Scribe mode)
10. AI conversational panel
11. ER triage board
12. ICU cockpit (bed grid)
13. OR schedule (today)
14. Discharge summary
15. Patient portal home
16. Patient portal: appointments
17. Patient portal: results explained
18. RAG chat (clinician)
19. Admin dashboard (tenant)
20. Compliance audit viewer

Each ships with ar + en + RTL/LTR variants.

---

## 7. Generation pipeline

```
For each screen:
1. Markdown spec (PM crafts)
2. Google Stitch → base HTML
3. Apply design tokens (script)
4. i18n keys (script)
5. Safe-HTML audit
6. Screenshot via Playwright
7. Snapshot to wireframes/{DEPT}/{page}.png
8. Storybook entry (component_doc.md)
```

---

## 8. Tests

- Visual regression (Playwright pixel-diff)
- RTL/LTR parity
- A11y (axe-core)
- Token usage audit (no hardcoded colors)

---

## 9. Files

```
.ai-brain/99-upgrade/17-wireframes/
├── DESIGN_TOKENS.yaml
├── tokens.css
├── components/
│   └── {COMPONENT}/index.md
├── layouts/                  # patterns
├── mocks/                    # full HTML pages
│   ├── login.html
│   ├── patient_chart.html
│   ├── ...
└── per-dept/
    ├── CARD-001/
    ├── PULM-001/
    └── ...
```

---

*Owner: PM — version 1.0 — 2026-08-01*

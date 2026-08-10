---
name: nm-stitch-google-v2
description: Use when generating Stitch Google HTML wireframes for any NamaMedical department page. 7 reusable archetypes + AR/EN + RTL/LTR + token-saver. Generates 200-line wireframe in ~50 tokens (vs 2k naive).
version: 2.0.0
---

# nm-stitch-google-v2

## 7 visual archetypes (used by 44_stitch_google.html per dept)

| # | Archetype | Example pages |
|---|---|---|
| 1 | **List + Filter** | Patient queue, lab orders, pharmacy queue |
| 2 | **Chart Detail** | Vitals trend, lab results, imaging |
| 3 | **Workflow Wizard** | Surgery consent, admission orders |
| 4 | **Form + Submit** | Create record, e-prescription, order |
| 5 | **Dashboard + KPI** | Quality dashboard, finance KPI |
| 6 | **Calendar/Schedule** | OR schedule, clinic appointments |
| 7 | **Real-time Monitor** | ICU monitor, ER triage board |

## Token-saver patterns

### Stitches (reusable HTML chunks)

| Stitch | Lines | Reuse count |
|---|---|---|
| `stitch-list-filter` | 30 | 80+ pages |
| `stitch-chart-detail` | 25 | 40+ pages |
| `stitch-workflow-wizard` | 35 | 20+ pages |
| `stitch-form-submit` | 25 | 100+ pages |
| `stitch-dashboard-kpi` | 30 | 30+ pages |
| `stitch-calendar-schedule` | 35 | 15+ pages |
| `stitch-real-time-monitor` | 40 | 10+ pages |

**Total: ~220 lines for ~295 pages = 0.75 lines per page average**

## Stitch catalog page (200 tokens)

```html
<!DOCTYPE html>
<html lang="ar-SA" dir="rtl">
<head>
  <title>{{dept_name}} - Visual Reference</title>
  <link rel="stylesheet" href="https://jumanasoft.com/static/nama.css" />
  <style>:root { --nama-primary:#0d6efd; --nama-radius:8px; }</style>
</head>
<body>
  <h1>{{dept_name}}</h1>
  <div class="card"><div class="preview">stitch-list-filter</div></div>
  <div class="card"><div class="preview">stitch-chart-detail</div></div>
  <div class="card"><div class="preview">stitch-workflow-wizard</div></div>
  <div class="card"><div class="preview">stitch-dashboard-kpi</div></div>
  <div class="card"><div class="preview">stitch-form-submit</div></div>
</body>
</html>
```

## Design tokens

```json
{
  "primary": "#0d6efd",
  "success": "#198754",
  "warning": "#ffc107",
  "danger":  "#dc3545",
  "radius":  "8px",
  "shadow":  "0 2px 6px rgba(0,0,0,.08)",
  "font":    "Tajawal, Inter, system-ui, sans-serif",
  "rtl":     true
}
```

## Mandatory accessibility

- WCAG AA: contrast ≥ 4.5:1
- Keyboard nav: Tab, Enter, Esc
- ARIA labels on icon-only buttons
- RTL: `dir="rtl"` on `<html>` + logical CSS properties (margin-inline-start, etc.)

## i18n pairs

| Arabic | English |
|---|---|
| اسم المريض | Patient name |
| البحث | Search |
| التاريخ | Date |
| حفظ | Save |
| حذف | Delete |
| طباعة | Print |
| تصدير | Export |

## Per-page structure

```
<div class="ref">
  <h1>{{dept_name}} — {{page_purpose}}</h1>
  <div class="meta">{{dept_id}} · generated 2026-08-10</div>
  <div class="card">
    <div class="preview-title">Page 1: ...</div>
    <div class="preview">[STITCH]</div>
  </div>
  ...
</div>
```

## How to invoke

```bash
/stitch-google --dept=DEP-001_cardiology
```

Or:
> "Generate 44_stitch_google.html for [dept] using nm-stitch-google-v2."

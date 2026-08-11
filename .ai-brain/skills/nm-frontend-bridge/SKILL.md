---
name: nm-frontend-bridge
description: Use when converting department blueprints, ERDs, or wireframes into working HTML/JS modules. Loads the canonical Stitch scaffold + API client + i18n wiring. Saves ~80% tokens per frontend bridge.
---

# Frontend Bridge — Token-Saver

## When to use

Convert blueprints into working pages:
- Department blueprint → Stitch HTML page
- ERD → forms/lists/detail panels
- Wireframe → Stitch Google page
- API endpoint list → page modules

## Pipeline

```
Blueprint  →  Wireframe  →  HTML skeleton  →  API wire  →  i18n keys  →  Page
     ↓            ↓              ↓                ↓              ↓
nm-44-bucket  nm-wireframe  nm-stitch-google  nm-router  nm-i18n-default
```

## Step 1 — Read blueprint

Read `.ai-brain/01_DEPT_BLUEPRINTS/{DEPT}/00_README.md` to extract:
- Display name (AR/EN/FR/UR)
- Icon
- 5-10 main endpoints
- 3-5 main user flows
- RBAC scope

## Step 2 — Define pages

For each department, generate 5 pages:

| Page | URL | Purpose |
|---|---|---|
| Index | `/departments/{dept}.html` | Overview, recent activity, KPIs |
| Queue | `/departments/{dept}-queue.html` | Patient list, status, action buttons |
| Detail | `/departments/{dept}-detail.html` | Single patient detail, history |
| Form/Calc | `/departments/{dept}-form.html` | Calculator or order form |
| Settings | `/departments/{dept}-settings.html` | Config, preferences |

## Step 3 — Generate HTML (use `nm-stitch-google`)

Each page uses the Stitch skeleton, fills in CONTENT HOOK with dept-specific blocks.

## Step 4 — Wire APIs

Use the canonical API client from `nm-router-middleware`:

```js
const data = await namaApi.get(`/{dept}/{resource}?patient_id=${id}`);
const result = await namaApi.post(`/{dept}/assessments/foo`, { ... });
```

## Step 5 — Add i18n keys

Add to all 4 locale files (`public/js/locales/{ar,en,fr,ur}.json`):

```json
{
  "cardiology": {
    "page_title": "أمراض القلب",
    "queue": {
      "title": "قائمة مرضى القلب",
      "mrn": "MRN",
      "name": "الاسم",
      "chief_complaint": "الشكوى الرئيسية",
      "status": "الحالة"
    },
    "grace_form": {
      "title": "حاسبة GRACE",
      "submit": "احسب",
      "results": "النتائج"
    }
  }
}
```

## Step 6 — Test in browser

```bash
node scripts/smoke.js --page=cardiology.html
# Should return 200 and render Arabic by default
```

## Required folder structure

```
public/departments/
  cardiology.html
  cardiology-queue.html
  cardiology-detail.html
  cardiology-form.html
  cardiology-settings.html
  oncology.html
  ... (5 pages × 122 depts = 610 pages)
```

## Required folder for assets

```
public/assets/departments/
  cardiology/
    icon.svg
    logo.png
    header-bg.jpg
  oncology/
    icon.svg
    ...
```

## Wireframe → Page checklist

For each blueprint:
- [ ] Identify 5 user-facing pages
- [ ] Choose appropriate layout (queue / form / detail)
- [ ] Generate HTML skeleton (Stitch Google)
- [ ] Wire 3-5 main API endpoints
- [ ] Add 10-30 i18n keys per page
- [ ] Add icon + brand asset
- [ ] Test AR / EN / FR / UR
- [ ] Test RTL / LTR flip
- [ ] Test mobile (≥ 320px wide)
- [ ] Test with no network (offline state)

## Token saving

Each dept bridge from scratch = ~1000 lines HTML + JS + i18n. With template = ~200
lines unique (page-specific layout, dept-specific endpoints). ~80% reduction.
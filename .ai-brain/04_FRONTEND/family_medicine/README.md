# Family Medicine — Stitch Google Frontend Pages

> Generated 2026-08-10 using `frontend_bridge.js --dept=family_medicine`
> Templates from `nm-stitch-google` + `nm-stitch-scaffold` skills.

## Pages

- [index.html](./index.html) — landing page
- [queue.html](./queue.html) — patient queue
- [detail.html](./detail.html) — patient detail
- [form.html](./form.html) — new visit form
- [settings.html](./settings.html) — dept config

## i18n keys

- [i18n_ar.json](./i18n_ar.json) — Arabic
- [i18n_en.json](./i18n_en.json) — English
- [i18n_fr.json](./i18n_fr.json) — French
- [i18n_ur.json](./i18n_ur.json) — Urdu

## Dept info

- **Display name (AR):** طب الأسرة
- **Display name (EN):** Family Medicine
- **Icon:** 🏠
- **Owner:** Family Medicine Department
- **Color:** #006B5F (Material Design primary)

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET  | /api/family_medicine/patients | patient queue |
| GET  | /api/family_medicine/patients/:id | patient detail |
| POST | /api/family_medicine/visits | new visit |
| PUT  | /api/family_medicine/visits/:id | update visit |
| POST | /api/family_medicine/assessments/screening | preventive screening |
| GET  | /api/family_medicine/health | health check |

## Common clinical engines

- `family_medicine_engine.js`
  - `wellnessScore` (preventive health)
  - `chronicDiseaseCount` (multi-morbidity)
  - `vaccinationSchedule` (immunization tracker)
  - `familyHistoryRisk` (genetic risk from family)
  - `preventiveScreening` (USPSTF-grade screening recommendations)

## Acceptance gate

- [x] 5 HTML pages
- [x] 4 i18n files
- [x] 100% key parity
- [x] RTL/LTR tested
- [x] Material tokens
- [x] Google Fonts (Cairo + Roboto)